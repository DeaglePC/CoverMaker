# Docker 使用说明

## 文件说明

- `Dockerfile` - 生产环境的 Docker 配置文件
- `Dockerfile.dev` - 开发环境的 Docker 配置文件  
- `docker-compose.yml` - Docker Compose 配置文件
- `.dockerignore` - Docker 构建忽略文件

## 使用方法

### 生产环境部署

```bash
# 启动生产环境服务
docker-compose up -d

# 或者直接构建和运行
docker build -t covermaker .
docker run -p 3000:80 covermaker
```

访问地址：http://localhost:3000

### 开发环境

```bash
# 启动开发环境服务（支持热重载）
docker-compose --profile dev up -d

# 或者单独启动开发容器
docker build -f Dockerfile.dev -t covermaker-dev .
docker run -p 5173:5173 -v ${PWD}:/app -v /app/node_modules covermaker-dev
```

访问地址：http://localhost:5173

### 常用命令

```bash
# 查看运行中的容器
docker ps

# 查看容器日志
docker logs covermaker-app

# 停止服务
docker-compose down

# 重新构建镜像
docker-compose build

# 清理未使用的镜像
docker image prune
```

## 注意事项

1. 生产环境使用 Nginx 作为 Web 服务器
2. 开发环境支持热重载，代码修改会自动更新
3. 确保 Docker 和 Docker Compose 已正确安装
4. 首次构建可能需要较长时间下载依赖 