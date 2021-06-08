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
                echo 'Hello World'
            }
        }
    }
}