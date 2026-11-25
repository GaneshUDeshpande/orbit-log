pipeline {
    agent any

    stages {
        stage('Check project files') {
            steps {
                sh '''
                    test -s index.html
                    test -s style.css
                    test -s Dockerfile
                    echo "All three Orbit Log files are ready."
                '''
            }
        }
    }
}
