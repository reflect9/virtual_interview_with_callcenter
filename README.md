# LifeGraphy

LG전자 CX부서를 위한 Lifegraphy 프로젝트 프로토타입

## 사용법

본 프로젝트를 처음 clone하면, 실행에 앞서 다음 스크립트를 통해서 필요한 설정 작업을 수행해야함.

### `npm install`

필요한 Javascript라이브러리를 설치함
- 참고 문서 (https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-up.html)


### `npm start`

개발모드에서 프로젝트를 실행함.\
자동으로 창이 열리지 않으면 브라우저(Google Chrome추천)에서 [http://localhost:3000](http://localhost:3000) 을 열면됨.


## 배포
- Build하기
`npm run build`
- Build이후에 EC2 (@reflect9@gmail.com)에 업로드하기 
`scp -i aws-ec2-a.pem -r build ec2-user@ec2-3-39-227-6.ap-northeast-2.compute.amazonaws.com:/var/www/html/virtualinterview`
- SSH로 EC2에 접속도 가능함
`ssh -i aws-ec2-a.pem ec2-user@ec2-3-39-227-6.ap-northeast-2.compute.amazonaws.com`
- EC2에서 Apache 서버 셋업하기 (httpd.conf화일을 변경하면됨)
`nano /etc/httpd/conf/httpd.conf`
- Apache 서버 다시 시작하기
`sudo service httpd restart`
- 업로드가 잘 되면 다음 URL로 접속가능: 
[ec2-3-39-227-6.ap-northeast-2.compute.amazonaws.com:84](ec2-3-39-227-6.ap-northeast-2.compute.amazonaws.com:84)# virtual_interview_with_callcenter
