# 构建报告

提交: `1336a4b6ac0aac2d08e4d424590eb75af7149a6b`
时间: 2026-10-06 00:25:55 UTC

## 结果
❌ 未产出 APK

## Gradle 日志（末尾 80 行）
```
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

> Task :app:compileDebugJavaWithJavac
Note: /home/runner/work/android_training/android_training/app/src/main/java/com/countto10/MainActivity.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.

> Task :app:mergeDebugShaders
> Task :app:compileDebugShaders NO-SOURCE
> Task :app:generateDebugAssets UP-TO-DATE
> Task :app:mergeDebugAssets
> Task :app:compressDebugAssets FROM-CACHE
> Task :app:desugarDebugFileDependencies FROM-CACHE
> Task :app:dexBuilderDebug
> Task :app:processDebugJavaRes NO-SOURCE
> Task :app:mergeDebugGlobalSynthetics
> Task :app:mergeDebugStartupProfile
> Task :app:mergeDebugJniLibFolders
> Task :app:checkDebugDuplicateClasses FAILED
> Task :app:mergeDebugNativeLibs NO-SOURCE
> Task :app:mergeDebugJavaResource

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:checkDebugDuplicateClasses'.
> A failure occurred while executing com.android.build.gradle.internal.tasks.CheckDuplicatesRunnable
   > Duplicate class kotlin.collections.jdk8.CollectionsJDK8Kt found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk8-1.6.21.jar -> kotlin-stdlib-jdk8-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.6.21)
     Duplicate class kotlin.internal.jdk7.JDK7PlatformImplementations found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk7-1.6.21.jar -> kotlin-stdlib-jdk7-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.6.21)
     Duplicate class kotlin.internal.jdk7.JDK7PlatformImplementations$ReflectSdkVersion found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk7-1.6.21.jar -> kotlin-stdlib-jdk7-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.6.21)
     Duplicate class kotlin.internal.jdk8.JDK8PlatformImplementations found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk8-1.6.21.jar -> kotlin-stdlib-jdk8-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.6.21)
     Duplicate class kotlin.internal.jdk8.JDK8PlatformImplementations$ReflectSdkVersion found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk8-1.6.21.jar -> kotlin-stdlib-jdk8-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.6.21)
     Duplicate class kotlin.io.path.ExperimentalPathApi found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk7-1.6.21.jar -> kotlin-stdlib-jdk7-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.6.21)
     Duplicate class kotlin.io.path.PathRelativizer found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk7-1.6.21.jar -> kotlin-stdlib-jdk7-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.6.21)
     Duplicate class kotlin.io.path.PathsKt found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk7-1.6.21.jar -> kotlin-stdlib-jdk7-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.6.21)
     Duplicate class kotlin.io.path.PathsKt__PathReadWriteKt found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk7-1.6.21.jar -> kotlin-stdlib-jdk7-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.6.21)
     Duplicate class kotlin.io.path.PathsKt__PathUtilsKt found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk7-1.6.21.jar -> kotlin-stdlib-jdk7-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.6.21)
     Duplicate class kotlin.jdk7.AutoCloseableKt found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk7-1.6.21.jar -> kotlin-stdlib-jdk7-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.6.21)
     Duplicate class kotlin.jvm.jdk8.JvmRepeatableKt found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk8-1.6.21.jar -> kotlin-stdlib-jdk8-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.6.21)
     Duplicate class kotlin.random.jdk8.PlatformThreadLocalRandom found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk8-1.6.21.jar -> kotlin-stdlib-jdk8-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.6.21)
     Duplicate class kotlin.streams.jdk8.StreamsKt found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk8-1.6.21.jar -> kotlin-stdlib-jdk8-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.6.21)
     Duplicate class kotlin.streams.jdk8.StreamsKt$asSequence$$inlined$Sequence$1 found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk8-1.6.21.jar -> kotlin-stdlib-jdk8-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.6.21)
     Duplicate class kotlin.streams.jdk8.StreamsKt$asSequence$$inlined$Sequence$2 found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk8-1.6.21.jar -> kotlin-stdlib-jdk8-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.6.21)
     Duplicate class kotlin.streams.jdk8.StreamsKt$asSequence$$inlined$Sequence$3 found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk8-1.6.21.jar -> kotlin-stdlib-jdk8-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.6.21)
     Duplicate class kotlin.streams.jdk8.StreamsKt$asSequence$$inlined$Sequence$4 found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk8-1.6.21.jar -> kotlin-stdlib-jdk8-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.6.21)
     Duplicate class kotlin.text.jdk8.RegexExtensionsJDK8Kt found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk8-1.6.21.jar -> kotlin-stdlib-jdk8-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.6.21)
     Duplicate class kotlin.time.jdk8.DurationConversionsJDK8Kt found in modules kotlin-stdlib-1.8.22.jar -> kotlin-stdlib-1.8.22 (org.jetbrains.kotlin:kotlin-stdlib:1.8.22) and kotlin-stdlib-jdk8-1.6.21.jar -> kotlin-stdlib-jdk8-1.6.21 (org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.6.21)
     
     Go to the documentation to learn how to <a href="d.android.com/r/tools/classpath-sync-errors">Fix dependency resolution errors</a>.

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.

BUILD FAILED in 35s
25 actionable tasks: 12 executed, 13 from cache
```

## 环境
```
openjdk version "17.0.20.1" 2026-08-18
OpenJDK Runtime Environment Temurin-17.0.20.1+1 (build 17.0.20.1+1)
OpenJDK 64-Bit Server VM Temurin-17.0.20.1+1 (build 17.0.20.1+1, mixed mode, sharing)
--- gradlew ---
-rwxr-xr-x 1 runner runner 657 Oct  6 00:25 ./gradlew
--- AndroidManifest ---
-rw-r--r-- 1 runner runner 1577 Oct  6 00:25 app/src/main/AndroidManifest.xml
--- 图标 ---
-rw-r--r-- 1 runner runner  493 Oct  6 00:25 app/src/main/res/mipmap-hdpi/ic_launcher.png
-rw-r--r-- 1 runner runner  359 Oct  6 00:25 app/src/main/res/mipmap-mdpi/ic_launcher.png
-rw-r--r-- 1 runner runner  670 Oct  6 00:25 app/src/main/res/mipmap-xhdpi/ic_launcher.png
-rw-r--r-- 1 runner runner  963 Oct  6 00:25 app/src/main/res/mipmap-xxhdpi/ic_launcher.png
-rw-r--r-- 1 runner runner 1234 Oct  6 00:25 app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
--- assets ---
total 48544
drwxr-xr-x 2 runner runner    4096 Oct  6 00:25 .
drwxr-xr-x 3 runner runner    4096 Oct  6 00:25 ..
-rw-r--r-- 1 runner runner    4101 Oct  6 00:25 app.js
-rw-r--r-- 1 runner runner    1056 Oct  6 00:25 capture-worklet.js
-rw-r--r-- 1 runner runner    7592 Oct  6 00:25 engine.js
-rw-r--r-- 1 runner runner    4280 Oct  6 00:25 fx.js
-rw-r--r-- 1 runner runner    4497 Oct  6 00:25 index.html
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:25 model.bin.part0
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:25 model.bin.part1
-rw-r--r-- 1 runner runner 1903441 Oct  6 00:25 model.bin.part10
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:25 model.bin.part2
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:25 model.bin.part3
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:25 model.bin.part4
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:25 model.bin.part5
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:25 model.bin.part6
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:25 model.bin.part7
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:25 model.bin.part8
-rw-r--r-- 1 runner runner 4194304 Oct  6 00:25 model.bin.part9
-rw-r--r-- 1 runner runner     831 Oct  6 00:25 model.manifest.json
-rw-r--r-- 1 runner runner    3269 Oct  6 00:25 numbers.js
-rw-r--r-- 1 runner runner 5804485 Oct  6 00:25 vosk.js
```
