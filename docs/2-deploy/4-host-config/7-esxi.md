# VMware ESXi 主机配置

<div class="oidc-todo">
  <span class="oidc-todo__label">待补充 · 维护者亲自撰写</span>
  <p>本页为字段口径与回填参数，数据存储与证书配置由维护者补充。</p>
</div>

前置：[ESXi 已安装](/deploy/platform/esxi)，443 对主控可达。

## 回填参数

| 字段 | 示例 | 说明 |
|---|---|---|
| 服务器名称 | `esxi-01` | 唯一 |
| 服务器类型 | vSphereESXi Server | `vSphereESXi` |
| 服务器地址 | `10.0.0.31:443` | 端口可省略 |
| 服务器用户 | `root` | — |
| 服务器密码 | `******` | — |
| 虚拟机前缀 | `oidc-` | 过滤 |
| 模板存储路径 | `[datastore1] ISO` | ISO |
| 数据存储路径 | `[datastore1]` | 实例磁盘 |
| 虚拟机数量限制 | `60` | — |

```bash
opidcs host add --name esxi-01 --type vSphereESXi --addr 10.0.0.31:443 --user root
opidcs host status esxi-01
```

## 验证

- [ ] 主机在线
- [ ] 实例列表与 vSphere 一致
- [ ] 控制台可打开
- [ ] 创建/删除闭环正常

## 待维护者补充

- [ ] 自签证书与受信证书的处理
- [ ] 免费版许可证限制
- [ ] 共享存储（iSCSI/NFS）路径写法
