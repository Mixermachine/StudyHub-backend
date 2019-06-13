pipeline {
  agent { label 'Build && NodeJS' }
  tools {nodejs "node"}

  stages {
    stage('Setup Check') {
      steps {
        sh 'node -v'
        sh 'npm config ls'
        script {
          currentBuild.result = 'SUCCESS'
        }
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
  post {
    always {
      sendEndStatusToSlack()
    }
  }
}

void sendEndStatusToSlack() {
  def attachments = []
  if ( currentBuild.result == "SUCCESS" ) {
        attachments = [
			[
			  text: "Job: " + currentBuild.displayName + " with build number " + currentBuild.number + " was successful.\n " + env.BUILD_URL,
			  fallback: "Build successful",
			  color: "good"
			]
		  ]
    }
    else if( currentBuild.result == "FAILURE" ) {
      attachments = [
			[
			  text: "Job: " + currentBuild.displayName + " with build number " + currentBuild.number + " has failed.\n " + env.BUILD_URL,
			  fallback: "Build has failed",
			  color: "failure"
			]
		  ]
    }
    else if( currentBuild.result == "UNSTABLE" ) {
	      attachments = [
			[
			  text: "Job: " + currentBuild.displayName + " with build number " + currentBuild.number + " is unstable.\n " + env.BUILD_URL,
			  fallback: "Build is unstable",
			  color: "warning"
			]
		  ]
    }
    else {
	      attachments = [
			[
			  text: "Job: " + currentBuild.displayName + " with build number " + currentBuild.number + " has finished with unclear result.\n " + env.BUILD_URL,
			  fallback: "Build has ended with unclear status",
			  color: "danger"
			]
		  ]
  }
  slackSend(channel: '#jenkins', attachments: attachments)
}