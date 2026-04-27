# Disclaimer

Please read the following disclaimer carefully before using OpenIDCS (Open Internet Data Center System). By using this software, you acknowledge that you have read, understood, and agreed to all terms of this disclaimer.

## Nature of the Software

OpenIDCS is an **open source software project** provided "AS IS", without warranty of any kind, express or implied.

### No Warranty Statement

According to Sections 15 and 16 of the GNU Affero General Public License v3.0:

> **To the extent permitted by applicable law, this program comes with no warranty.** Unless otherwise stated in writing, the copyright holders and/or other parties provide the program "AS IS" without warranty of any kind, express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose. The entire risk as to the quality and performance of the program is with you. If the program proves defective, you assume the cost of all necessary servicing, repair, or correction.

## Risks of Use

### 1. Data Security

- ⚠️ OpenIDCS manages virtual machines, which may affect your production environment
- ⚠️ Improper use may cause data loss or system failures
- ⚠️ We recommend thorough testing before production deployment
- ⚠️ Please back up important data regularly

**We are not responsible for any data loss caused by the use of this software.**

### 2. System Stability

- ⚠️ The software may contain undiscovered bugs or security vulnerabilities
- ⚠️ Compatibility may vary across different environments
- ⚠️ Third-party dependencies may affect system stability
- ⚠️ Network issues may cause service interruptions

**We do not guarantee that the software will run properly in all environments.**

### 3. Security

- ⚠️ Keep access credentials and certificates safe
- ⚠️ Use firewalls to restrict access sources
- ⚠️ Update the software regularly to fix security vulnerabilities
- ⚠️ Follow security best practices

**We are not responsible for losses caused by improper security configuration.**

## Limitation of Liability

### 1. Direct Losses

Under no circumstances shall the OpenIDCS project team, contributors, or copyright holders be liable for any of the following:

- Data loss or corruption
- Business interruption or loss of revenue
- System failures or performance degradation
- Security vulnerabilities or data breaches
- Third-party claims or litigation

### 2. Indirect Losses

We are not liable for any indirect, special, incidental, or consequential damages, including but not limited to:

- Loss of profits
- Loss of goodwill
- Loss of data or information
- Cost of procurement of substitute goods or services
- Other economic losses

### 3. Liability Cap

Even if we have been advised of the possibility of such damages, our liability shall not exceed the amount you paid (if any) to obtain this software.

## Third-Party Components

### 1. Dependency Libraries

OpenIDCS uses multiple third-party open source libraries, including but not limited to:

- Flask (web framework)
- SQLite (database)
- Docker SDK (container management)
- pylxd (LXD management)
- pyvmomi (VMware management)

These components have their own licenses and disclaimers. Please refer to their official documentation.

### 2. Virtualization Platforms

OpenIDCS integrates with the following virtualization platforms:

- VMware Workstation / vSphere ESXi
- Docker / Podman
- LXC / LXD
- Other virtualization platforms

**We are not responsible for the functionality, performance, or security of these third-party platforms.**

### 3. External Services

OpenIDCS may integrate with external services (such as image registries, DNS services):

- We do not control these external services
- We are not responsible for their availability
- We are not responsible for their data processing

## Usage Limitations

### 1. Applicable Scenarios

OpenIDCS is suitable for:

- ✅ Development and testing environments
- ✅ Small-scale production (after thorough testing)
- ✅ Learning and research purposes
- ✅ Non-critical business systems

OpenIDCS may not be suitable for:

- ❌ Mission-critical systems (without thorough testing)
- ❌ Large-scale production (without performance verification)
- ❌ High-security environments (without security audits)
- ❌ Scenarios requiring SLA guarantees

### 2. Technical Support

- Community support is provided through GitHub Issues and Discussions
- No guarantee of response time or issue resolution
- Commercial support requires separate purchase
- We reserve the right to refuse support

### 3. Updates and Maintenance

- We will do our best to maintain and update the software
- No guarantee of regular updates or long-term support
- Development or maintenance may be halted at any time
- No guarantee of backward compatibility

## Legal Compliance

### 1. License Compliance

By using OpenIDCS, you agree to comply with all terms of the AGPLv3 license. Violation may result in:

- Loss of the right to use the software
- Legal action
- Financial compensation

### 2. Export Controls

OpenIDCS may be subject to export control laws:

- You are responsible for complying with applicable export control laws
- Do not export the software to restricted countries or regions
- Do not use for restricted purposes

### 3. Intellectual Property

- OpenIDCS trademarks and logos belong to the project team
- Do not use trademarks without authorization
- Contributed code is licensed under AGPLv3

## Privacy and Data

### 1. Data Collection

OpenIDCS itself does not collect user data, but:

- Log files may contain sensitive information
- You are responsible for securing log files
- Regular log cleanup is recommended

### 2. Data Processing

- All data processing is done locally
- No data is sent to third parties (unless you configure external services)
- You are responsible for complying with applicable data protection laws (e.g. GDPR)

### 3. Cookies and Sessions

- OpenIDCS uses cookies to manage user sessions
- No third-party tracking cookies
- You can configure cookie policies

## Modification and Distribution

### 1. Modifying the Software

If you modify OpenIDCS:

- You are responsible for ensuring the modified version works correctly
- We are not responsible for modified versions
- You must comply with AGPLv3

### 2. Distributing the Software

If you distribute OpenIDCS:

- You must include the complete license and disclaimer
- You must provide source code or a way to obtain it
- Do not remove or modify copyright notices

## Dispute Resolution

### 1. Applicable Law

This disclaimer is governed by the laws of the People's Republic of China (excluding conflict-of-law rules).

### 2. Dispute Resolution Methods

Any dispute arising from this disclaimer shall be resolved by:

1. Friendly negotiation
2. Mediation
3. Arbitration or litigation

### 3. Jurisdiction

For litigation, it shall be filed in a court with jurisdiction in the location of the project team.

## Changes to This Disclaimer

We reserve the right to modify this disclaimer at any time:

- The modified disclaimer will be published on the project website
- Continued use of the software indicates acceptance of the modifications
- We recommend checking for updates regularly

## Contact

For any questions about this disclaimer, please contact:

- **Email**: legal@openidcs.org
- **GitHub**: https://github.com/OpenIDCSTeam/OpenIDCS-Client/issues
- **Website**: https://openidcs.org

## Special Reminders

### ⚠️ Production Use

Before using OpenIDCS in production, please:

1. ✅ Test thoroughly in a staging environment
2. ✅ Develop a detailed deployment plan
3. ✅ Prepare a rollback plan
4. ✅ Set up monitoring and alerting
5. ✅ Back up data regularly
6. ✅ Train relevant personnel
7. ✅ Prepare emergency response plans

### ⚠️ Security Recommendations

To protect your system security:

1. ✅ Use strong passwords and TLS certificates
2. ✅ Restrict network access sources
3. ✅ Regularly update software and dependencies
4. ✅ Monitor system logs
5. ✅ Follow security best practices
6. ✅ Conduct regular security audits

### ⚠️ Backup Recommendations

To prevent data loss:

1. ✅ Regularly back up virtual machines
2. ✅ Back up configuration files and databases
3. ✅ Test backup restoration procedures
4. ✅ Store backups off-site
5. ✅ Automate backup processes

## Final Statement

**By using OpenIDCS, you acknowledge that you have read, understood, and agreed to all terms of this disclaimer. If you do not agree to any part of this disclaimer, please do not use this software.**

**This software is provided "AS IS" without warranty of any kind. All risks of using this software are yours to bear.**

---

**Last Updated**: January 2024

**Version**: 1.0

For any questions or suggestions, please contact us through the channels above.
