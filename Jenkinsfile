pipeline {
    agent any

    options {
        skipDefaultCheckout()
        disableConcurrentBuilds()
    }

    triggers {
        pollSCM('H/2 * * * *')
    }

    stages {
        stage('Get code') {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh '''
                    commit=$(git rev-parse --short HEAD)
                    built_at=$(date -u '+%Y-%m-%d %H:%M UTC')

                    sed -i \
                        -e "s/__BUILD_NUMBER__/$BUILD_NUMBER/g" \
                        -e "s/__GIT_SHA__/$commit/g" \
                        -e "s/__BUILD_TIME_UTC__/$built_at/g" \
                        index.html

                    docker build -t "orbit-log:$BUILD_NUMBER" .
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    preview=$(docker run -d "orbit-log:$BUILD_NUMBER")
                    trap 'docker rm -f "$preview" >/dev/null' EXIT

                    for attempt in 1 2 3 4 5; do
                        if docker exec "$preview" wget -qO /tmp/orbit-check.html http://127.0.0.1/ &&
                           docker exec "$preview" grep -Fq "#$BUILD_NUMBER<" /tmp/orbit-check.html; then
                            echo "Orbit Log is serving the expected build."
                            exit 0
                        fi
                        sleep 1
                    done

                    echo "Orbit Log failed the website check."
                    exit 1
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    if docker container inspect orbit-log-live >/dev/null 2>&1; then
                        docker rm -f orbit-log-live
                    fi

                    docker run -d --name orbit-log-live \
                        -p 8091:80 "orbit-log:$BUILD_NUMBER"
                '''
            }
        }
    }
}
