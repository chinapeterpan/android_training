#!/bin/sh
#
# Gradle 启动脚本（简化版，兼容 Git Bash / WSL / Linux / macOS）
# Windows 上如需双击运行，可另建 gradlew.bat 调用本脚本。
#

APP_HOME=$(cd "$(dirname "$0")" && pwd)
CLASSPATH="$APP_HOME/gradle/wrapper/gradle-wrapper.jar"

if [ -n "$JAVA_HOME" ] && [ -x "$JAVA_HOME/bin/java" ]; then
    JAVACMD="$JAVA_HOME/bin/java"
elif command -v java >/dev/null 2>&1; then
    JAVACMD=java
else
    echo "错误：找不到 java。请安装 JDK 17 并设置 JAVA_HOME。" >&2
    exit 1
fi

exec "$JAVACMD" \
    "-Dorg.gradle.appname=gradlew" \
    -classpath "$CLASSPATH" \
    org.gradle.wrapper.GradleWrapperMain \
    "$@"
