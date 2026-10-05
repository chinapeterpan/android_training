# 报数挑战 · Android APK 构建指南

把网页版打包成可安装的 Android 应用。**完全离线，录音不出设备。**

---

## 先回答最关心的问题：OPPO 会拦安装吗

**不会挡死。** 具体情况：

| 场景 | ColorOS 行为 |
|------|-------------|
| 从文件管理器点 APK 安装 | 弹一次「未知来源」确认框，点「继续安装」即可 |
| 装完之后正常使用 | 完全正常，不影响 |
| 应用市场检测到非官方渠道 | 可能提示「建议从官方渠道安装」，**可以忽略** |

被挡住的只有一种情况：你装完后再从应用市场点「更新」，会被拦。这跟我们无关。

**首次安装步骤**（OPPO /一加 / realme 通用）：

1. 手机「设置 → 其他设置 → 权限管理 → 安装未知应用」
2. 选中你用来打开 APK 的应用（文件管理器 / 微信 / QQ）
3. 打开「允许安装应用」
4. 返回点击 APK 安装

---

## 你需要先装两个东西

你当前电脑**只有 Java 8，没有 Android 构建工具**。需要装：

### 1. JDK 17（必需）

下载地址：<https://adoptium.net/temurin/releases/?version=17>

装完后设置环境变量 `JAVA_HOME` 指向 JDK 目录，例如：
```
C:\Program Files\Java\jdk-17
```

### 2. Android SDK（必需）

下载地址：<https://developer.android.com/studio>

建议直接装 **Android Studio**（自带SDK 和图形化工具），装完在
`Settings → SDK Manager` 里勾选：

- `Android SDK Platform 34`
- `Android SDK Build-Tools 34`
- `Android SDK Command-line Tools`

然后设置环境变量 `ANDROID_HOME` 指向 SDK 目录，通常是：
```
C:\Users\你的用户名\AppData\Local\Android\Sdk
```

> **国内网络提示**：SDK 下载慢的话，在 SDK Manager 的
> `Settings → Appearance` 里开启镜像，或直接用
> `sdkmanager --channel=0` 配合国内镜像源。

---

## 构建方式一：Android Studio（推荐新手）

1. 打开 Android Studio → `Open`
2. 选`android-app` 这个文件夹
3. 等待 Gradle 同步完成（会自动下载依赖，约 5-10 分钟）
4. 菜单 `Build → Build Bundle(s) / APK(s) → Build APK(s)`
5. 完成后在 `app/build/outputs/apk/debug/app-debug.apk` 找到安装包

命令行等价操作：

```bash
cd android-app
./gradlew assembleDebug      # Windows 用gradlew.bat assembleDebug
```

---

## 构建方式二：GitHub Actions 云端构建（不用装工具）

如果你不想在本机装 SDK，这是最省事的路子。GitHub 的服务器上有完整环境。

###步骤

1. 在 GitHub 新建一个仓库（可以设为 Private）

2. 把 `android-app` 目录里的**所有文件**上传上去
   （注意 `app/src/main/assets/www/` 有 47MB，需要用 Git LFS
   或者直接用命令行 `git add` 提交，GitHub 单文件限制是 100MB，
   47MB 不会超）

3. 打开仓库的 `Actions` 标签 → 点 `构建 APK` → `Run workflow`

4. 等 5-10 分钟，构建完成后在页面底部下载 `count-to-10-apk`

命令行提交方式：

```bash
cd android-app
git init
git add -A
git commit -m "报数挑战"
git remote add origin https://github.com/你的用户名/你的仓库.git
git push -u origin main
```

---

## 项目结构

```
android-app/
├── build.gradle                 顶层构建配置
├── settings.gradle              仓库配置（已配国内镜像）
├── gradle.properties            JVM 内存与 AndroidX 开关
├── gradlew / gradlew.bat        构建启动脚本
├── gradle/wrapper/              Gradle 8.7 wrapper
├── .github/workflows/           云端构建配置
└── app/
    ├── build.gradle             应用构建配置
    └── src/main/
        ├── AndroidManifest.xml  权限声明
        ├── java/com/countto10/MainActivity.java
        ├── res/                 图标、主题、布局
        └── assets/www/          网页资源 + 11 个模型分片（47MB）
```

---

## 实现要点

### 1. 为什么用 WebView 而不是原生开发

识别逻辑（Vosk WASM + grammar 约束）在网页版已经跑通且验证过，
用 WebView 直接复用，**不用重写一遍识别算法**，也省掉了 Kotlin/Java
处理音频流的麻烦。整个 App 只有一个 Java 文件。

### 2. 关键：必须用 WebViewAssetLoader

最初我打算用 `file:///android_asset/www/index.html` 加载，但这是错的：
**`file://` 协议下页面的 `fetch()` 读模型分片会被跨源策略拦死**，
表现就是页面永远卡在「正在加载模型」。

正确做法是用官方 `WebViewAssetLoader`，它把 assets 映射成
`https://appassets.androidplatform.net/assets/www/index.html`——
这是标准 https 源，fetch 正常工作。

```java
assetLoader = new WebViewAssetLoader.Builder()
        .addPathHandler("/assets/",
            new WebViewAssetLoader.AssetsPathHandler(this))
        .build();

// 拦截请求交给 assetLoader
webView.setWebViewClient(new WebViewClient() {
    @Override
    public WebResourceResponse shouldInterceptRequest(
            WebView view, WebResourceRequest request) {
        return assetLoader.shouldInterceptRequest(request.getUrl());
    }
});
```

### 3. 关键：必须处理 onPermissionRequest

Android WebView **不会自动弹麦克风授权框**。必须显式处理，
否则页面的 `getUserMedia` 拿不到音频流：

```java
webView.setWebChromeClient(new WebChromeClient() {
    @Override
    public void onPermissionRequest(PermissionRequest request) {
        if (hasMicPermission()) {
            request.grant(request.getResources());
        } else {
            request.deny();
        }
    }
});
```

### 4. 隐私设计：不给网络权限

`AndroidManifest.xml` 里显式移除了 `INTERNET` 和 `ACCESS_NETWORK_STATE`：

```xml
<uses-permission android:name="android.permission.INTERNET" tools:node="remove" />
```

也就是说**这个 App 在系统层面就无法联网**。识别全在设备本地完成，
录音不可能外传。这不是承诺，是从权限上做不到。

### 5. 模型为什么切成 11 片

APK 里放的是 `model.bin.part0` ~ `part10`（每片 4MB）+ `model.manifest.json`，
页面按清单顺序读取后拼成完整模型。

切成小片的原因：Android 构建时对单个大文件处理很慢，容易触发
`Failed to collect dependencies` 之类的错误。

---

## 常见问题

**Q：构建报 `SDK location not found`**
A：`ANDROID_HOME` 没设，或设错了。改成 SDK 根目录
（不是 `platforms` 那一层）。也可以在工程根目录建`local.properties`：
```
sdk.dir=C:\\Users\\你的用户名\\AppData\\Local\\Android\\Sdk
```

**Q：Gradle 同步卡在下载依赖**
A：国内网络问题。`settings.gradle` 里已经配了阿里云镜像，
若仍不行，检查是不是手动改过仓库配置。

**Q：App 打开后一直显示「正在加载模型」**
A：99% 是 `shouldInterceptRequest` 没配好。检查 `APP_URL` 是否是
`https://appassets.androidplatform.net/assets/www/index.html`，
而不是 `file://`。

**Q：点了「开始报数」没反应 / 提示没权限**
A：确认 `onPermissionRequest` 已实现，且 `RECORD_AUDIO` 已授权。

**Q：APK 装上后闪退**
A：多半是 WebView 版本太老。App 用的 `AudioWorklet` 需要
Android System WebView 较新版本，在应用商店更新一下
「Android System WebView」即可。

**Q：识别很慢**
A：正常现象。42MB 模型在 WebView 里初始化要几秒，
之后每次识别约几百毫秒。

**Q：APK 体积多大**
A：约 50MB（模型 42MB + vosk 库 5.5MB + 页面代码）。

---

## 换成自己的图标

编辑 `app/src/main/res/mipmap-*/ic_launcher.png`（五档密度），
或者用 Android Studio 的 Image Asset 工具生成。
