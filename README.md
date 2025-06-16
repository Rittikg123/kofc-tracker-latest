1. Clone repository


2. Open a CMD prompt, cd to \kofc-tracker-latest


3. Run one line at a time:

rd /s /q node_modules

rd /s /q backend\node_modules

rd /s /q frontend\node_modules

del package-lock.json

del backend\package-lock.json

del frontend\package-lock.json

npm install

cd backend

npm install

cd ../frontend

npm install

cd ..

psql -U postgres -d kofc -f "C:\<file path>\kofc-tracker-latest\users_schema.sql" //password is Rittik03

psql -U postgres -d kofc -f "C:\<file path>\kofc-tracker-latest\exemps_schema.sql" //password is Rittik03

psql -U postgres -d kofc -f "C:\<file path>\kofc-tracker-latest\cats_schema.sql" //password is Rittik03

psql -U postgres -d kofc -f "C:\<file path>\kofc-tracker-latest\users_data.sql"   //password is Rittik03

INSERT INTO users (first_name, last_name, email, password, role)VALUES (  'Admin',   'User',   'admin@example.com',   '$2a$10$tE7uI612CPWLg/u.kHUgquvw3/fRg3VCT6.9JSYuOkAJopIfmdiBK',  'admin');


4. Open two more CMD prompts, cd one to \kofc-tracker-latest\frontend and the other to \kofc-tracker-latest\backend


5. Run "npm run dev" in both


6. Go to http://localhost:5173 in browser. Try to login/register with an example email/name. Admin account is admin@example.com, password is testpass
