#!/usr/bin/env bash
# API QA suite: functional, negative, boundary, security and resilience checks.
# Mutates data and restarts the backend: run it only against a throwaway stack.
set -u
ENV_FILE="${1:?usage: api-qa.sh path/to/.env}"
API=${E2E_BACKEND_URL:-http://localhost:8080}; WEB=${E2E_FRONTEND_URL:-http://localhost:3000}
TMP="$(dirname "$0")/.tmp-api"; rm -rf "$TMP"; mkdir -p "$TMP"
SECRET=$(grep '^INTERNAL_API_SECRET=' "$ENV_FILE" | cut -d= -f2-)
ADMIN_USER=$(grep "^ADMIN_USERNAME=" "$ENV_FILE" | cut -d= -f2-); ADMIN_USER=${ADMIN_USER:-admin}
ADMIN_PW=$(grep "^ADMIN_PASSWORD=" "$ENV_FILE" | cut -d= -f2-)
[ -n "$ADMIN_PW" ] || { echo "ADMIN_PASSWORD must be set in $ENV_FILE"; exit 2; }
PASS=0; FAIL=0; FAILED=()
section() { echo; echo "== $1"; }
check() { if [ "$2" == "$3" ]; then echo "PASS  $1"; PASS=$((PASS+1)); else echo "FAIL  $1 (expected $2, got $3)"; FAIL=$((FAIL+1)); FAILED+=("$1"); fi; }
code() { curl -s -o "$TMP/body" -w '%{http_code}' "$@"; }
js() { node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const o=JSON.parse(d);const v=eval('o'+process.argv[1]);console.log(typeof v==='object'?JSON.stringify(v):v)}catch(e){console.log('PARSE_ERR')}})" "$1"; }
body() { js "$1" < "$TMP/body"; }
J='Content-Type: application/json'
login() { curl -s -X POST $API/api/auth/login -H "$J" -d "{\"identifier\":\"$1\",\"password\":\"$2\"}" | js .token; }
register() { code -X POST $API/api/auth/register -H "$J" -d "{\"username\":\"$1\",\"email\":\"$2\",\"password\":\"$3\"}"; }

section "Auth & registration"
ADMIN=$(login "$ADMIN_USER" "$ADMIN_PW"); [ ${#ADMIN} -gt 20 ] && check "admin login" ok ok || check "admin login" ok fail
check "register alice" 201 "$(register alice alice@example.com secret12)"; ALICE_ID=$(body .id)
check "register bob" 201 "$(register bob bob@example.com secret12)"; BOB_ID=$(body .id)
check "username trimmed on register" "carol" "$(register '  carol  ' carol@example.com secret12 >/dev/null; body .username)"
check "username with HTML rejected" 400 "$(register '<script>x' x1@example.com secret12)"
check "username too short" 400 "$(register ab ab@example.com secret12)"
check "password too short" 400 "$(register dave dave@example.com 12345)"
check "invalid email" 400 "$(register dave not-an-email secret12)"
check "missing body" 400 "$(code -X POST $API/api/auth/register -H "$J")"
check "malformed JSON" 400 "$(code -X POST $API/api/auth/register -H "$J" -d '{bad json')"
check "duplicate username" 409 "$(register alice other@example.com secret12)"
check "duplicate email (different case)" 409 "$(register alice2 ALICE@EXAMPLE.COM secret12)"
ALICE=$(login alice secret12); BOB=$(login bob secret12)
check "login by email" 200 "$(code -X POST $API/api/auth/login -H "$J" -d '{"identifier":"alice@example.com","password":"secret12"}')"
check "login by email is case-insensitive" 200 "$(code -X POST $API/api/auth/login -H "$J" -d '{"identifier":"Alice@Example.com","password":"secret12"}')"
check "login unknown user" 401 "$(code -X POST $API/api/auth/login -H "$J" -d '{"identifier":"ghost","password":"secret12"}')"
check "login blank fields" 400 "$(code -X POST $API/api/auth/login -H "$J" -d '{"identifier":"","password":""}')"
check "login response has expiry" 86400000 "$(code -X POST $API/api/auth/login -H "$J" -d '{"identifier":"alice","password":"secret12"}' >/dev/null; body .expiresInMs)"

section "Race conditions"
for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w '%{http_code}\n' -X POST $API/api/auth/register -H "$J" -d '{"username":"racer","email":"racer@example.com","password":"secret12"}' & done > "$TMP/race" ; wait
check "parallel duplicate registrations: exactly one 201" 1 "$(grep -c 201 "$TMP/race")"
check "parallel duplicate registrations: no 500s" 0 "$(grep -c 500 "$TMP/race")"

section "Token handling"
check "no token" 401 "$(code $API/api/users/me)"
check "garbage token" 401 "$(code -H 'Authorization: Bearer garbage' $API/api/users/me)"
NONE_TOKEN="$(printf '{"alg":"none"}' | base64 | tr -d '=' | tr '/+' '_-').$(printf '{"sub":"1"}' | base64 | tr -d '=' | tr '/+' '_-')."
check "alg=none token rejected" 401 "$(code -H "Authorization: Bearer $NONE_TOKEN" $API/api/users/me)"
check "Basic auth not accepted" 401 "$(code -u "$ADMIN_USER:$ADMIN_PW" $API/api/users/me)"

section "Projects"
check "list projects" 200 "$(code -H "Authorization: Bearer $ALICE" $API/api/projects/microservices)"
check "4 demo projects seeded" 4 "$(body .length)"
P1=$(body '[0].id')
check "project details" 200 "$(code -H "Authorization: Bearer $ALICE" $API/api/projects/$P1)"
check "details include port" true "$(body '.port!=null')"
check "unknown project 404" 404 "$(code -H "Authorization: Bearer $ALICE" $API/api/projects/999999)"
check "non-numeric project id 400" 400 "$(code -H "Authorization: Bearer $ALICE" $API/api/projects/abc)"
mk() { code -X POST -H "Authorization: Bearer $ADMIN" -H "$J" $API/api/projects/create -d "$1"; }
check "create: name required" 400 "$(mk '{"port":80}')"
check "create: port 0 rejected" 400 "$(mk '{"name":"X","port":0}')"
check "create: port 65536 rejected" 400 "$(mk '{"name":"X","port":65536}')"
check "create: description > 2000 rejected" 400 "$(mk "{\"name\":\"X\",\"port\":80,\"description\":\"$(printf 'a%.0s' $(seq 1 2001))\"}")"
check "create: data: URL rejected" 400 "$(mk '{"name":"X","port":80,"liveUrl":"data:text/html,hi"}')"
check "create: minimal project" 201 "$(mk '{"name":"  Minimal  ","port":1}')"
check "create: name trimmed" Minimal "$(body .name)"
check "create: default version" v1.0.0 "$(body .version)"
check "create: XSS-looking name stored verbatim" 201 "$(mk '{"name":"<img src=x onerror=alert(1)>","port":81,"techStack":["Go","Go"," Rust "]}')"
XSS_ID=$(body .id)
check "create: tech stack trimmed & deduplicated" '["Go","Rust"]' "$(body .techStack)"
check "create: unknown team member ignored" 201 "$(mk '{"name":"Ghosts","port":82,"teamMembers":["nobody"]}')"
check "create: no members assigned" 0 "$(body .teamCount)"
check "user cannot create" 403 "$(code -X POST -H "Authorization: Bearer $ALICE" -H "$J" $API/api/projects/create -d '{"name":"X","port":80}')"
check "newest project listed first" Ghosts "$(code -H "Authorization: Bearer $ALICE" $API/api/projects/microservices >/dev/null; body '[0].name')"

section "Tasks"
task() { code -X POST -H "Authorization: Bearer $1" -H "$J" $API/api/tasks -d "$2"; }
check "blank title" 400 "$(task $ALICE "{\"title\":\"   \",\"projectId\":$P1}")"
check "missing project" 400 "$(task $ALICE '{"title":"x"}')"
check "unknown project" 404 "$(task $ALICE '{"title":"x","projectId":999999}')"
check "title > 200 chars" 400 "$(task $ALICE "{\"title\":\"$(printf 'a%.0s' $(seq 1 201))\",\"projectId\":$P1}")"
check "invalid difficulty" 400 "$(task $ALICE "{\"title\":\"x\",\"projectId\":$P1,\"difficulty\":\"EXTREME\"}")"
check "create task" 201 "$(task $ALICE "{\"title\":\"Alice task\",\"projectId\":$P1,\"difficulty\":\"MEDIUM\"}")"; T1=$(body .id)
check "task keeps difficulty" MEDIUM "$(body .difficulty)"
check "list own tasks" 1 "$(code -H "Authorization: Bearer $ALICE" $API/api/tasks >/dev/null; body .length)"
check "bob sees none of alice's tasks" 0 "$(code -H "Authorization: Bearer $BOB" $API/api/tasks >/dev/null; body .length)"
check "bob cannot toggle" 404 "$(code -X PATCH -H "Authorization: Bearer $BOB" $API/api/tasks/$T1/toggle)"
check "non-admin assigneeId ignored" 0 "$(task $BOB "{\"title\":\"For alice?\",\"projectId\":$P1,\"assigneeId\":$ALICE_ID}" >/dev/null; code -H "Authorization: Bearer $ALICE" $API/api/tasks >/dev/null; body '.filter(t=>t.title==="For alice?").length')"
check "admin assigns task to alice" 201 "$(task $ADMIN "{\"title\":\"From admin\",\"projectId\":$P1,\"assigneeId\":$ALICE_ID}")"
check "assigned task shows for alice" 2 "$(code -H "Authorization: Bearer $ALICE" $API/api/tasks >/dev/null; body .length)"
check "admin assignee must exist" 404 "$(task $ADMIN "{\"title\":\"x\",\"projectId\":$P1,\"assigneeId\":999999}")"
check "toggle twice returns to open" false "$(code -X PATCH -H "Authorization: Bearer $ALICE" $API/api/tasks/$T1/toggle >/dev/null; code -X PATCH -H "Authorization: Bearer $ALICE" $API/api/tasks/$T1/toggle >/dev/null; body .isCompleted)"
check "delete own task" 204 "$(code -X DELETE -H "Authorization: Bearer $ALICE" $API/api/tasks/$T1)"
check "deleted task is gone" 404 "$(code -X PATCH -H "Authorization: Bearer $ALICE" $API/api/tasks/$T1/toggle)"
check "unsupported method" 405 "$(code -X PUT -H "Authorization: Bearer $ALICE" -H "$J" $API/api/tasks/1 -d '{}')"

section "Dashboard"
code -H "Authorization: Bearer $ALICE" $API/api/dashboard/summary >/dev/null
check "dashboard OK" true "$(body '.stats!=null')"
check "productivity 0% with 1 open task" 0 "$(body .stats.productivity)"
check "recent projects capped at 5" true "$(body '.recentProjects.length<=5')"
check "relative update time is real" true "$(body '.recentProjects.every(p=>p.updatedAt==="just now"||p.updatedAt.endsWith("ago"))')"

section "Profile & preferences"
check "invalid theme" 400 "$(code -X PATCH -H "Authorization: Bearer $ALICE" -H "$J" $API/api/users/me/preferences -d '{"themePreference":"PINK"}')"
check "set dark theme" DARK "$(code -X PATCH -H "Authorization: Bearer $ALICE" -H "$J" $API/api/users/me/preferences -d '{"themePreference":"DARK","notificationsEnabled":false}' >/dev/null; body .themePreference)"
check "preferences persisted" false "$(code -H "Authorization: Bearer $ALICE" $API/api/users/me >/dev/null; body .notificationsEnabled)"
check "email taken (case-insensitive)" 409 "$(code -X PATCH -H "Authorization: Bearer $ALICE" -H "$J" $API/api/users/me -d '{"email":"BOB@example.com"}')"
check "invalid email on update" 400 "$(code -X PATCH -H "Authorization: Bearer $ALICE" -H "$J" $API/api/users/me -d '{"email":"nope"}')"
check "own email case change allowed" 200 "$(code -X PATCH -H "Authorization: Bearer $ALICE" -H "$J" $API/api/users/me -d '{"email":"Alice@example.com"}')"
check "change email" 200 "$(code -X PATCH -H "Authorization: Bearer $ALICE" -H "$J" $API/api/users/me -d '{"email":"alice.new@example.com"}')"
check "tasks follow email change" 1 "$(code -H "Authorization: Bearer $ALICE" $API/api/tasks >/dev/null; body .length)"
check "new password too short" 400 "$(code -X PATCH -H "Authorization: Bearer $ALICE" -H "$J" $API/api/users/me/password -d '{"oldPassword":"secret12","newPassword":"123"}')"
check "change password" 200 "$(code -X PATCH -H "Authorization: Bearer $ALICE" -H "$J" $API/api/users/me/password -d '{"oldPassword":"secret12","newPassword":"newsecret12"}')"
check "old password no longer works" 401 "$(code -X POST $API/api/auth/login -H "$J" -d '{"identifier":"alice","password":"secret12"}')"
check "new password works" 200 "$(code -X POST $API/api/auth/login -H "$J" -d '{"identifier":"alice","password":"newsecret12"}')"

section "Avatar upload"
printf 'GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;' > "$TMP/a.gif"
printf '\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01' > "$TMP/a.jpg"
printf 'RIFF\x1a\x00\x00\x00WEBPVP8 ' > "$TMP/a.webp"
printf '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>' > "$TMP/a.svg"
head -c 2500000 /dev/urandom > "$TMP/big.png"
up() { code -X POST -H "Authorization: Bearer $ALICE" -F "file=@$1${2:-}" $API/api/users/me/avatar; }
check "GIF accepted" 200 "$(up "$TMP/a.gif")"; FIRST=$(body .avatar)
check "JPEG accepted" 200 "$(up "$TMP/a.jpg")"
check "WebP accepted" 200 "$(up "$TMP/a.webp")"; LAST=$(body .avatar)
check "SVG rejected" 400 "$(up "$TMP/a.svg" ';type=image/svg+xml')"
check "file > 2MB rejected with 413" 413 "$(up "$TMP/big.png" ';type=image/png')"
check "empty upload rejected" 400 "$(code -X POST -H "Authorization: Bearer $ALICE" $API/api/users/me/avatar)"
check "previous avatar file deleted" 404 "$(code $API$FIRST)"
check "current avatar served" 200 "$(code $API$LAST)"
check "avatar via frontend proxy" 200 "$(code $WEB$LAST)"
check "proxy refuses traversal" 404 "$(code "$WEB/uploads/..%2F..%2Fapp.jar")"
check "proxy 404 for missing file" 404 "$(code "$WEB/uploads/nope.png")"

section "Team assignment"
as() { code -X PATCH -H "Authorization: Bearer $1" -H "$J" $API/api/users/$2/assign -d "$3"; }
check "user cannot assign" 403 "$(as $ALICE $BOB_ID "{\"projectId\":$P1}")"
check "projectId required" 400 "$(as $ADMIN $BOB_ID '{}')"
check "invalid project role" 400 "$(as $ADMIN $BOB_ID "{\"projectId\":$P1,\"projectRole\":\"CEO\"}")"
check "unknown project" 404 "$(as $ADMIN $BOB_ID '{"projectId":999999}')"
check "unknown user" 404 "$(as $ADMIN 999999 "{\"projectId\":$P1}")"
check "assign default role" DEVELOPER "$(as $ADMIN $BOB_ID "{\"projectId\":$P1}" >/dev/null; body .projectRole)"
check "project name returned" true "$(body '.projectName!=null')"
check "member shows in project" 1 "$(code -H "Authorization: Bearer $BOB" $API/api/projects/$P1 >/dev/null; body '.team.filter(m=>m.name==="bob").length')"
check "member role label" Developer "$(body '.team.find(m=>m.name==="bob").role')"
check "unassign" null "$(code -X PATCH -H "Authorization: Bearer $ADMIN" $API/api/users/$BOB_ID/unassign >/dev/null; body .projectId)"
check "list users hides passwords" 0 "$(code -H "Authorization: Bearer $BOB" $API/api/users >/dev/null; grep -ci 'password' "$TMP/body")"

section "Social login"
soc() { code -X POST $API/api/auth/social -H "$J" -H "X-Internal-Secret: $SECRET" -d "$1"; }
check "missing email" 400 "$(soc '{"username":"x"}')"
check "invalid email" 400 "$(soc '{"email":"nope"}')"
check "links to existing account by email (case-insensitive)" bob "$(soc '{"email":"BOB@example.com","avatar":"https://example.com/b.png"}' >/dev/null; body .username)"
check "updates avatar from Google" https://example.com/b.png "$(body .avatar)"
check "new social user gets USER role" USER "$(soc "{\"email\":\"new.g@example.com\",\"username\":\"$ADMIN_USER\"}" >/dev/null; body .role)"
check "colliding social username gets suffix" "${ADMIN_USER}_1" "$(body .username)"

section "Admin"
check "stats" 200 "$(code -H "Authorization: Bearer $ADMIN" $API/api/admin/stats)"
check "stats: totalUsers >= 6" true "$(body '.totalUsers>=6')"
check "stats: new users today counted" true "$(body '.newUsersToday>=6')"
check "stats: active sessions tracked" true "$(body '.activeSessions>=2')"
check "stats: at most 5 events" true "$(body '.systemEvents.length<=5')"
check "maintenance status endpoint" false "$(code -H "Authorization: Bearer $ADMIN" $API/api/admin/status >/dev/null; body .maintenance)"
check "flush cache" 200 "$(code -X POST -H "Authorization: Bearer $ADMIN" $API/api/admin/flush-cache)"
check "user cannot toggle maintenance" 403 "$(code -X POST -H "Authorization: Bearer $BOB" $API/api/admin/lockdown)"
code -X POST -H "Authorization: Bearer $ADMIN" $API/api/admin/lockdown >/dev/null
check "maintenance: user login still possible" 200 "$(code -X POST $API/api/auth/login -H "$J" -d '{"identifier":"bob","password":"secret12"}')"
check "maintenance: user API blocked" 503 "$(code -H "Authorization: Bearer $BOB" $API/api/tasks)"
check "maintenance: health still up" 200 "$(code $API/actuator/health)"
check "maintenance: public status reports it" true "$(code $API/api/system/status >/dev/null; body .maintenance)"
code -X POST -H "Authorization: Bearer $ADMIN" $API/api/admin/lockdown >/dev/null
check "maintenance off: user API back" 200 "$(code -H "Authorization: Bearer $BOB" $API/api/tasks)"
check "maintenance off: public status reports it" false "$(code $API/api/system/status >/dev/null; body .maintenance)"
check "public status is read-only" 401 "$(code -X POST $API/api/system/status)"

section "HTTP hardening"
check "CORS allows frontend origin" "http://localhost:3000" "$(curl -s -o /dev/null -D - -X OPTIONS $API/api/tasks -H 'Origin: http://localhost:3000' -H 'Access-Control-Request-Method: GET' | tr -d '\r' | grep -i '^access-control-allow-origin' | cut -d' ' -f2)"
check "CORS rejects foreign origin" 403 "$(code -X OPTIONS $API/api/tasks -H 'Origin: https://evil.example' -H 'Access-Control-Request-Method: GET')"
check "backend sends nosniff" 1 "$(curl -s -D - -o /dev/null $API/actuator/health | grep -ci 'x-content-type-options: nosniff')"
check "frontend sends X-Frame-Options" 1 "$(curl -s -D - -o /dev/null $WEB/login | grep -ci 'x-frame-options: deny')"
check "frontend hides X-Powered-By" 0 "$(curl -s -D - -o /dev/null $WEB/login | grep -ci 'x-powered-by')"
check "error responses do not leak stack traces" 0 "$(code -H "Authorization: Bearer $ALICE" $API/api/projects/abc >/dev/null; grep -ci 'exception\|at com\.' "$TMP/body")"
check "swagger UI available" 200 "$(code -L $API/swagger-ui.html)"
check "frontend health is minimal for anonymous" '{"status":"UP"}' "$(curl -s $WEB/api/health)"

section "Performance (single request latency)"
for ep in /api/dashboard/summary /api/projects/microservices /api/users; do
  t=$(curl -s -o /dev/null -w '%{time_total}' -H "Authorization: Bearer $ADMIN" $API$ep)
  check "$ep under 500ms (${t}s)" true "$(node -e "console.log($t<0.5)")"
done

section "Resilience: admin restart"
check "restart accepted" 200 "$(code -X POST -H "Authorization: Bearer $ADMIN" $API/api/admin/restart)"
sleep 3
for i in $(seq 1 60); do [ "$(curl -s -o /dev/null -w '%{http_code}' $API/actuator/health)" == 200 ] && break; sleep 2; done
check "backend back up after restart" 200 "$(code $API/actuator/health)"
check "existing token still valid after restart" 200 "$(code -H "Authorization: Bearer $BOB" $API/api/users/me)"
check "data persisted across restart" true "$(code -H "Authorization: Bearer $ADMIN" $API/api/users >/dev/null; body '.length>=6')"

echo; echo "API QA — Passed: $PASS  Failed: $FAIL"
for f in "${FAILED[@]}"; do echo "  ✗ $f"; done
rm -rf "$TMP"
