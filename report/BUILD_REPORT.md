# 构建报告

提交: `2899a8cc3e224afa9811afd79027d237d0834abb`
时间: 2026-10-06 00:16:12 UTC

## 结果
❌ 未产出 APK

## Gradle 日志（末尾 80 行）
```

Welcome to Gradle 8.7!

Here are the highlights of this release:
 - Compiling and testing with Java 22
 - Cacheable Groovy script compilation
 - New methods in lazy collection properties

For more details see https://docs.gradle.org/8.7/release-notes.html

To honour the JVM settings for this build a single-use Daemon process will be forked. For more on this, please refer to https://docs.gradle.org/8.7/userguide/gradle_daemon.html#sec:disabling_the_daemon in the Gradle documentation.
Daemon will be stopped at the end of the build 
Build was configured to prefer settings repositories over project repositories but repository 'maven' was added by initialization script '/home/runner/.gradle/init.gradle'
Build was configured to prefer settings repositories over project repositories but repository 'maven2' was added by initialization script '/home/runner/.gradle/init.gradle'
Build was configured to prefer settings repositories over project repositories but repository 'Google' was added by initialization script '/home/runner/.gradle/init.gradle'
Build was configured to prefer settings repositories over project repositories but repository 'MavenRepo' was added by initialization script '/home/runner/.gradle/init.gradle'
Build was configured to prefer settings repositories over project repositories but repository 'maven' was added by initialization script '/home/runner/.gradle/init.gradle'
Build was configured to prefer settings repositories over project repositories but repository 'maven2' was added by initialization script '/home/runner/.gradle/init.gradle'
Build was configured to prefer settings repositories over project repositories but repository 'Google' was added by initialization script '/home/runner/.gradle/init.gradle'
Build was configured to prefer settings repositories over project repositories but repository 'MavenRepo' was added by initialization script '/home/runner/.gradle/init.gradle'
> Task :app:preBuild UP-TO-DATE
> Task :app:preDebugBuild UP-TO-DATE
> Task :app:mergeDebugNativeDebugMetadata NO-SOURCE
> Task :app:javaPreCompileDebug FROM-CACHE
> Task :app:generateDebugResValues FROM-CACHE
> Task :app:checkDebugAarMetadata
> Task :app:mapDebugSourceSetPaths
> Task :app:generateDebugResources FROM-CACHE
> Task :app:mergeDebugResources FROM-CACHE
> Task :app:packageDebugResources FROM-CACHE
> Task :app:parseDebugLocalResources FROM-CACHE
> Task :app:createDebugCompatibleScreenManifests
> Task :app:extractDeepLinksDebug FROM-CACHE
> Task :app:processDebugMainManifest FROM-CACHE
> Task :app:processDebugManifest FROM-CACHE
> Task :app:processDebugManifestForPackage FROM-CACHE
> Task :app:processDebugResources FROM-CACHE

> Task :app:compileDebugJavaWithJavac FAILED
/home/runner/work/android_training/android_training/app/src/main/java/com/countto10/MainActivity.java:125: error: package com.android.webkit does not exist
            public void onPermissionRequest(@NonNull com.android.webkit.PermissionRequest request) {
                                                                       ^
Note: /home/runner/work/android_training/android_training/app/src/main/java/com/countto10/MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
1 error

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:compileDebugJavaWithJavac'.
> Compilation failed; see the compiler error output for details.

* Try:
> Run with --info option to get more log output.
> Run with --scan to get full insights.

BUILD FAILED in 22s
15 actionable tasks: 4 executed, 11 from cache
```

## 环境
```
openjdk version "17.0.20.1" 2026-08-18
OpenJDK Runtime Environment Temurin-17.0.20.1+1 (build 17.0.20.1+1)
OpenJDK 64-Bit Server VM Temurin-17.0.20.1+1 (build 17.0.20.1+1, mixed mode, sharing)
--- gradlew ---
-rwxr-xr-x 1 runner runner 657 Oct  6 00:15 ./gradlew
--- AndroidManifest ---
-rw-r--r-- 1 runner runner 1577 Oct  6 00:15 app/src/main/AndroidManifest.xml
--- 图标 ---
-rw-r--r-- 1 runner runner  493 Oct  6 00:15 app/src/main/res/mipmap-hdpi/ic_launcher.png
-rw-r--r-- 1 runner runner  359 Oct  6 00:15 app/src/main/res/mipmap-mdpi/ic_launcher.png
-rw-r--r-- 1 runner runner  670 Oct  6 00:15 app/src/main/res/mipmap-xhdpi/ic_launcher.png
-rw-r--r-- 1 runner runner  963 Oct  6 00:15 app/src/main/res/mipmap-xxhdpi/ic_launcher.png
-rw-r--r-- 1 runner runner 1234 Oct  6 00:15 app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
--- assets ---
total 48544
drwxr-xr-x 2 runner runner    4096 Oct  6 00:15 .
drwxr-xr-x 3 runner runner    4096 Oct  6 00:15 ..
-rw-r--r-- 1 runner runner    4101 Oct  6 00:15 app.js
-rw-r--r-- 1 runner runner    1056 Oct  6 00:15 capture-worklet.js
-rw-r--r-- 1 runner runner    7592 Oct  6 00:15 engine.js
-rw-r--r-- 1 runner runner    4280 Oct  6 00:15 fx.js
-rw-r--r-- 1 runner runner    4497 Oct  6 00:15 index.html
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:15 model.bin.part0
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:15 model.bin.part1
-rw-r--r-- 1 runner runner 1903441 Oct  6 00:15 model.bin.part10
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:15 model.bin.part2
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:15 model.bin.part3
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:15 model.bin.part4
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:15 model.bin.part5
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:15 model.bin.part6
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:15 model.bin.part7
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:15 model.bin.part8
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:15 model.bin.part9
-rw-r--r-- 1 runner runner     831 Oct  6 00:15 model.manifest.json
-rw-r--r-- 1 runner runner    3269 Oct  6 00:15 numbers.js
-rw-r--r-- 1 runner runner 5804485 Oct  6 00:15 vosk.js
```
