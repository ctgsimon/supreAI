# New API 项目运行指南

根据您的环境检查结果，您当前无法使用 Docker 运行本项目。因此，本指南将指导您通过**源码编译**的方式来运行项目。

## 环境检查结果

- **Go**: ✅ 已安装 (正在下载/更新中)
- **Node.js**: ✅ 已安装 (v22.16.0)
- **npm**: ✅ 已安装 (v11.7.0)
- **Docker**: ❌ 未安装 (无法使用 Docker 部署)

## 运行步骤

### 1. 准备工作：解决 PowerShell 权限问题

如果在运行 `npm` 命令时遇到类似 `UnauthorizedAccess` 的错误，请在 PowerShell 中执行以下命令以临时允许脚本执行：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 2. 构建前端

前端代码位于 `web` 目录下，需要先编译生成静态资源。

```powershell
# 进入前端目录
cd web

# 安装依赖
npm install

# 构建前端资源
npm run build
```

构建完成后，会在 `web/dist` 目录下生成静态文件。后端程序会嵌入这些文件。

### 3. 运行后端

回到项目根目录，启动 Go 后端服务。

```powershell
# 回到根目录
cd ..

# 运行项目
go run main.go
```

### 4. 访问项目

项目启动成功后，您可以在浏览器中访问：

**http://localhost:3000**

初始账号密码（通常情况，具体请参考控制台输出或数据库初始化情况）：
- 用户名：`root`
- 密码：`123456`

## 常见问题

1.  **端口冲突**：如果 3000 端口被占用，可以在 `.env` 文件中设置 `PORT` 环境变量，或者直接在命令行中设置：
    ```powershell
    $env:PORT="3001"; go run main.go
    ```
2.  **依赖下载慢**：
    - Go: `go env -w GOPROXY=https://goproxy.cn,direct`
    - npm: `npm config set registry https://registry.npmmirror.com`
