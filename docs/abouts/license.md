# 开源协议

OpenIDCS 采用 **GNU Affero General Public License v3.0 (AGPLv3)** 开源协议。

## 协议概述

AGPLv3 是一个强 Copyleft 开源许可证，它确保软件及其修改版本保持开源和自由。

### 主要特点

#### ✅ 您可以

- **自由使用**：可以自由地运行程序，用于任何目的
- **学习和修改**：可以学习程序的工作原理，并根据需要进行修改
- **自由分发**：可以自由地分发程序的副本
- **分发修改版本**：可以分发修改后的版本，帮助他人
- **商业使用**：可以将软件用于商业目的

#### ⚠️ 您必须

- **保持开源**：如果您分发修改后的版本，必须以相同的许可证开源
- **提供源代码**：必须提供完整的源代码或提供获取源代码的方式
- **保留版权声明**：必须保留原始的版权声明和许可证信息
- **声明修改**：如果您修改了代码，必须明确标注修改内容
- **网络服务开源**：如果您通过网络提供服务，也必须提供源代码（这是 AGPL 与 GPL 的主要区别）

#### ❌ 您不能

- **闭源使用**：不能将修改后的版本闭源
- **更改许可证**：不能将代码重新授权为其他许可证
- **移除版权**：不能移除或修改版权声明

## AGPLv3 vs GPLv3

AGPLv3 是 GPLv3 的扩展版本，主要区别在于网络服务条款：

| 特性 | GPLv3 | AGPLv3 |
|------|-------|--------|
| 分发软件时需要开源 | ✅ | ✅ |
| 修改软件时需要开源 | ✅ | ✅ |
| 网络服务需要开源 | ❌ | ✅ |
| 适用场景 | 桌面应用、工具 | Web 服务、SaaS |

### 网络服务条款

AGPLv3 的第 13 条规定：

> 如果您修改了程序，并且让用户通过计算机网络与修改后的版本进行交互，您必须为这些用户提供获取修改后版本源代码的机会。

这意味着：
- 如果您基于 OpenIDCS 搭建了一个 SaaS 服务
- 即使您没有"分发"软件（用户只是通过网络访问）
- 您仍然需要向用户提供源代码

## 使用场景

### ✅ 允许的使用场景

#### 1. 内部使用
在公司或组织内部使用 OpenIDCS，无需开源修改。

```
公司 A 使用 OpenIDCS 管理内部虚拟机
→ 不需要开源（仅内部使用）
```

#### 2. 开源项目
基于 OpenIDCS 开发新功能并开源。

```
开发者 B 为 OpenIDCS 添加新功能
→ 以 AGPLv3 开源修改后的代码
→ 可以合并到主项目
```

#### 3. 商业支持服务
提供 OpenIDCS 的安装、配置、培训等服务。

```
公司 C 提供 OpenIDCS 商业支持
→ 可以收费提供服务
→ 不需要额外授权
```

### ⚠️ 需要注意的场景

#### 1. SaaS 服务
基于 OpenIDCS 提供在线虚拟机管理服务。

```
公司 D 基于 OpenIDCS 搭建 SaaS 平台
→ 必须向用户提供源代码
→ 包括所有修改和扩展
```

#### 2. 分发修改版本
将修改后的 OpenIDCS 分发给客户。

```
公司 E 修改 OpenIDCS 并销售给客户
→ 必须以 AGPLv3 开源
→ 客户有权获取源代码
```

#### 3. 集成到产品中
将 OpenIDCS 集成到商业产品中。

```
公司 F 将 OpenIDCS 集成到产品中
→ 整个产品必须以 AGPLv3 开源
→ 或者重新实现相关功能
```

## 常见问题

### Q: 我可以将 OpenIDCS 用于商业用途吗？

**A:** 可以。AGPLv3 允许商业使用，但如果您修改了代码并提供网络服务，必须开源修改后的代码。

### Q: 我可以基于 OpenIDCS 开发闭源产品吗？

**A:** 不可以。AGPLv3 要求衍生作品也必须以 AGPLv3 开源。

### Q: 我可以提供 OpenIDCS 的商业支持服务吗？

**A:** 可以。您可以提供安装、配置、培训、定制开发等商业服务，无需额外授权。

### Q: 如果我只在公司内部使用，需要开源吗？

**A:** 不需要。只要不向外部用户提供服务或分发软件，内部使用无需开源。

### Q: 我可以将 OpenIDCS 与其他许可证的软件集成吗？

**A:** 取决于其他软件的许可证。AGPLv3 与大多数开源许可证兼容，但与某些专有许可证不兼容。

### Q: 如果我发现了 bug 并修复，必须贡献回项目吗？

**A:** 不强制，但我们鼓励您贡献回项目。如果您分发修改后的版本或提供网络服务，则必须开源修改。

## 许可证兼容性

### ✅ 兼容的许可证

- GPLv3
- LGPLv3
- Apache License 2.0（单向兼容）
- MIT License
- BSD License
- MPL 2.0

### ❌ 不兼容的许可证

- GPLv2（没有"或更高版本"条款）
- 专有许可证
- 某些限制性开源许可证

## 如何遵守 AGPLv3

### 1. 保留版权声明

在所有源文件中保留原始的版权声明：

```python
# OpenIDC-Client - Open Source IDC Virtualization Management Platform
# Copyright (C) 2024 OpenIDCS Team
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
```

### 2. 提供源代码

如果您提供网络服务，在界面中添加源代码链接：

```html
<footer>
  <p>
    This service is powered by OpenIDCS.
    <a href="/source">Get Source Code</a>
  </p>
</footer>
```

### 3. 声明修改

如果您修改了代码，添加修改说明：

```python
# Modified by Company X on 2024-01-01
# Changes: Added support for XYZ feature
```

### 4. 包含许可证文件

在项目根目录包含 `LICENSE` 文件（完整的 AGPLv3 文本）。

## 获取商业许可

如果 AGPLv3 不适合您的使用场景，您可以联系我们获取商业许可：

- **邮箱**：business@openidcs.org
- **网站**：https://openidcs.org/commercial

商业许可可以：
- 闭源使用和分发
- 集成到专有软件
- 提供 SaaS 服务而无需开源
- 获得技术支持和服务保证

## 完整许可证文本

完整的 AGPLv3 许可证文本请查看项目根目录的 [LICENSE](https://github.com/OpenIDCSTeam/OpenIDCS-Client/blob/main/LICENSE) 文件。

您也可以访问：
- [GNU 官方网站](https://www.gnu.org/licenses/agpl-3.0.html)
- [中文翻译版本](https://www.gnu.org/licenses/agpl-3.0.zh-cn.html)

## 参考资源

- [AGPLv3 官方文档](https://www.gnu.org/licenses/agpl-3.0.html)
- [AGPLv3 FAQ](https://www.gnu.org/licenses/gpl-faq.html)
- [开源许可证选择指南](https://choosealicense.com/)
- [SPDX 许可证列表](https://spdx.org/licenses/)

## 免责声明

本页面提供的信息仅供参考，不构成法律建议。如有法律问题，请咨询专业律师。

---

**最后更新**：2024年1月

如有任何关于许可证的问题，请联系：legal@openidcs.org
