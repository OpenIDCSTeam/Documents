# Oracle VirtualBox deployment

VirtualBox is for single-machine desktop testing. The engine has `is_remote = false`: **the controller must run on the same machine**.

## Install

```powershell
# Windows: installer + Extension Pack
VBoxManage --version
```

```bash
# Linux
sudo apt install -y virtualbox virtualbox-ext-pack
sudo usermod -aG vboxusers $USER

# macOS
brew install --cask virtualbox
```

## Configure

```bash
VBoxManage list vms
VBoxManage modifyvm "<vm>" --vrde on --vrdeport 5000
```

## Add the host

| Field | Example |
|---|---|
| Name | `vbox-local` |
| Type | Oracle VirtualBox |
| Address | `localhost` |
| VBoxManage path | `C:\Program Files\Oracle\VirtualBox` |
| Image path | `D:\VBox\Images` |
| Data path | `D:\VBox\VMs` |

```bash
opidcs plat install virtualbox
opidcs host add --name vbox-local --type VirtualBoxs --addr localhost
```

## Capabilities

No GPU/PCI passthrough; USB with the Extension Pack; ISO and extra disks; VRDE (RDP) console.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Cannot connect | controller must be on the same host |
| USB missing | install Extension Pack |
| RDP fails | check VRDE port and firewall |
