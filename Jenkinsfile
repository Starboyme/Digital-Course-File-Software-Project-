pipeline {
    agent any
    environment {
        CI = 'true'
    }
    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Cloning Git') {
            steps {
                git 'https://github.com/rajpradeep01/Digital-Course-File-Software-Project-.git'
            }
        }
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Jest test'){
            steps{
                sh 'npm run test'
            }
        }
        stage('Docker image creation') {
            steps {
                sh '''docker login --username ashwith433 --password docker@123321
                docker build . -t ashwith433/digital_course_file --pull=true
                docker push ashwith433/digital_course_file
                '''
                echo "Completed docker image building"
            }
        }
    }
}