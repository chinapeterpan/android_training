package com.countto10;

import android.Manifest;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.webkit.WebViewAssetLoader;

/**
 * 报数挑战 —— 语音报 1 到 10，数满自动欢呼。
 *
 * 实现方式：WebView 加载 assets 里的网页，识别全部在设备本地完成。
 * 好处是完全离线、录音不出设备、也没有 42MB 模型的网络传输问题。
 *
 * 关键点（踩过的坑）：
 *  1. 必须用 WebViewAssetLoader 把 assets 映射成 https 源。
 *     直接用 file:// 加载会导致 fetch() 读模型分片被 CORS 拦死，
 *     页面会一直卡在「正在加载模型」。
 *  2. 必须处理 onPermissionRequest，否则 WebView 不会弹麦克风授权。
 *  3. 页面跑在 Worker 里的 WASM，需要开JavaScript。
 */
public class MainActivity extends AppCompatActivity {

    private static final int REQ_MIC = 1001;

    /** 映射后的虚拟域名，是标准 https 源，fetch 能正常读 assets */
    private static final String ASSET_HOST = "appassets.androidplatform.net";
    private static final String APP_URL =
            "https://" + ASSET_HOST + "/assets/www/index.html";

    private WebView webView;
    private WebViewAssetLoader assetLoader;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);

        // 官方推荐的 assets 加载器：把 assets 目录映射成 https 虚拟域名。
        // 这样页面里的 fetch() 可以正常读取模型分片，不会被 file:// 的跨源策略拦住。
        assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        setupWebView();

        // 先拿麦克风权限，再加载页面，避免首次点击没反应
        if (hasMicPermission()) {
            webView.loadUrl(APP_URL);
        } else {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC);
        }
    }

    private boolean hasMicPermission() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                == PackageManager.PERMISSION_GRANTED;
    }

    private void setupWebView() {
        WebSettings s = webView.getSettings();

        s.setJavaScriptEnabled(true);

        // 关闭安全浏览提示：页面全在本地，访问 assets 不会触发任何风险检测
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            s.setSafeBrowsingEnabled(false);
        }

        // 页面按固定视口渲染，不要让WebView 自行缩放
        s.setUseWideViewPort(false);
        s.setLoadWithOverviewMode(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);

        // Web Audio 需要自动播放能力
        s.setMediaPlaybackRequiresUserGesture(false);

        // DOM 存储
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);

        // 仍然保留 file访问能力，作为兜底
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view,
                                                              WebResourceRequest request) {
                // 把 assets 目录的请求交给 assetLoader 处理
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view,
                                                    WebResourceRequest request) {
                // 页面内跳转留在 WebView 内，不外跳系统浏览器
                return true;
            }
        });

        // 关键：WebView 不会自动弹麦克风授权框，必须在这里显式处理。
        // 页面里的 getUserMedia 依赖这个回调才能拿到流。
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(@NonNull com.android.webkit.PermissionRequest request) {
                runOnUiThread(() -> {
                    if (hasMicPermission()) {
                        request.grant(request.getResources());
                    } else {
                        request.deny();
                        ActivityCompat.requestPermissions(MainActivity.this,
                                new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC);
                    }
                });
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == REQ_MIC) {
            if (grantResults.length > 0
                    && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                webView.loadUrl(APP_URL);
            } else {
                Toast.makeText(this,
                        "需要麦克风权限才能识别语音",
                        Toast.LENGTH_LONG).show();
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
