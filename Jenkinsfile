pipeline {
  agent { label 'Build && NodeJS' }

  tools {nodejs "node"}

  stages {
    stage('Setup Check') {
      steps {
        sh 'node -v'
        sh 'npm config ls'
      }
    }
	stage('NPM install') {
      steps {
        sh 'npm install'
      }
    }
	stage('NPM test') {
      steps {
        sh 'npm test'
      }
    }
  }
}
