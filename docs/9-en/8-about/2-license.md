# Open Source License

QuickIDC is licensed under the **GNU Affero General Public License v3.0 (AGPLv3)**.

## License Overview

AGPLv3 is a strong Copyleft open source license that ensures software and its modified versions remain open and free.

### Key Characteristics

#### ✅ You Can

- **Use freely**: Run the program for any purpose
- **Study and modify**: Study how the program works and modify it as needed
- **Redistribute freely**: Distribute copies of the program
- **Distribute modified versions**: Share modifications to help others
- **Commercial use**: Use the software for commercial purposes

#### ⚠️ You Must

- **Keep it open source**: If you distribute modified versions, they must also be released under AGPLv3
- **Provide source code**: Provide the complete source code or a way to obtain it
- **Retain copyright notices**: Keep all original copyright notices and license information
- **Declare modifications**: Clearly mark any changes you make
- **Open source network services**: If you provide the software as a network service, you must also provide source code (the main difference between AGPL and GPL)

#### ❌ You Cannot

- **Close the source**: You cannot close-source modified versions
- **Change the license**: You cannot relicense the code under another license
- **Remove copyrights**: You cannot remove or modify copyright notices

## AGPLv3 vs GPLv3

AGPLv3 is an extended version of GPLv3, with the main difference being the network service clause:

| Feature | GPLv3 | AGPLv3 |
|---------|-------|--------|
| Open source required when distributing | ✅ | ✅ |
| Open source required when modifying | ✅ | ✅ |
| Open source required for network services | ❌ | ✅ |
| Typical use cases | Desktop apps, tools | Web services, SaaS |

### Network Service Clause

Clause 13 of AGPLv3 states:

> If you modify the program and let users interact with the modified version over a computer network, you must provide those users with the opportunity to obtain the source code of the modified version.

This means:
- If you build a SaaS service based on QuickIDC
- Even if you don't "distribute" the software (users only access it via the network)
- You still need to provide the source code to your users

## Use Cases

### ✅ Allowed Use Cases

#### 1. Internal Use
Use QuickIDC internally within a company or organization without needing to open source modifications.

```
Company A uses QuickIDC to manage internal VMs
→ No need to open source (internal use only)
```

#### 2. Open Source Projects
Develop new features based on QuickIDC and open source them.

```
Developer B adds new features to QuickIDC
→ Releases modifications under AGPLv3
→ Can be merged back into the main project
```

#### 3. Commercial Support Services
Provide installation, configuration, training and other services for QuickIDC.

```
Company C provides commercial support for QuickIDC
→ Can charge for services
→ No additional licensing needed
```

### ⚠️ Use Cases Requiring Attention

#### 1. SaaS Services
Providing online VM management services based on QuickIDC.

```
Company D builds a SaaS platform based on QuickIDC
→ Must provide source code to users
→ Including all modifications and extensions
```

#### 2. Distributing Modified Versions
Distributing modified QuickIDC to customers.

```
Company E modifies QuickIDC and sells to customers
→ Must be released under AGPLv3
→ Customers have the right to obtain source code
```

#### 3. Integration into Products
Integrating QuickIDC into commercial products.

```
Company F integrates QuickIDC into their product
→ The entire product must be released under AGPLv3
→ Or reimplement the relevant features
```

## FAQ

### Q: Can I use QuickIDC for commercial purposes?

**A:** Yes. AGPLv3 allows commercial use, but if you modify the code and provide it as a network service, you must open source the modifications.

### Q: Can I develop closed-source products based on QuickIDC?

**A:** No. AGPLv3 requires derivative works to also be released under AGPLv3.

### Q: Can I offer commercial support services for QuickIDC?

**A:** Yes. You can provide installation, configuration, training, custom development and other commercial services without additional licensing.

### Q: Do I need to open source if I only use it internally?

**A:** No. As long as you don't provide services to external users or distribute the software, internal use doesn't require open sourcing.

### Q: Can I integrate QuickIDC with software under other licenses?

**A:** It depends on the other software's license. AGPLv3 is compatible with most open source licenses, but incompatible with some proprietary licenses.

### Q: If I find and fix a bug, must I contribute it back?

**A:** Not mandatory, but we encourage contributing back. If you distribute modified versions or provide network services, you must open source the modifications.

## License Compatibility

### ✅ Compatible Licenses

- GPLv3
- LGPLv3
- Apache License 2.0 (one-way compatible)
- MIT License
- BSD License
- MPL 2.0

### ❌ Incompatible Licenses

- GPLv2 (without "or later" clause)
- Proprietary licenses
- Some restrictive open source licenses

## How to Comply with AGPLv3

### 1. Retain Copyright Notices

Keep the original copyright notices in all source files:

```python
# OpenIDC-Client - Open Source IDC Virtualization Management Platform
# Copyright (C) 2024 QuickIDC Team
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
```

### 2. Provide Source Code

If you provide a network service, add a source code link in the UI:

```html
<footer>
  <p>
    This service is powered by QuickIDC.
    <a href="/source">Get Source Code</a>
  </p>
</footer>
```

### 3. Declare Modifications

If you modify the code, add modification notices:

```python
# Modified by Company X on 2024-01-01
# Changes: Added support for XYZ feature
```

### 4. Include the License File

Include the `LICENSE` file (full AGPLv3 text) in the project root directory.

## Obtaining a Commercial License

If AGPLv3 doesn't suit your use case, you may contact us for a commercial license:

- **Email**: business@quickidc.org
- **Website**: https://quickidc.org/commercial

A commercial license allows you to:
- Use and distribute under closed source
- Integrate into proprietary software
- Provide SaaS without open sourcing
- Get technical support and service guarantees

## Full License Text

For the complete AGPLv3 license text, see the [LICENSE](https://github.com/OpenIDCSTeam/CloudHost/blob/main/LICENSE) file in the project root.

You can also visit:
- [GNU Official Website](https://www.gnu.org/licenses/agpl-3.0.html)

## References

- [AGPLv3 Official Documentation](https://www.gnu.org/licenses/agpl-3.0.html)
- [AGPLv3 FAQ](https://www.gnu.org/licenses/gpl-faq.html)
- [Choose a License](https://choosealicense.com/)
- [SPDX License List](https://spdx.org/licenses/)

## Disclaimer

The information on this page is for reference only and does not constitute legal advice. For legal questions, please consult a professional attorney.

---

**Last Updated**: January 2024

For any license-related questions, please contact: legal@quickidc.org
