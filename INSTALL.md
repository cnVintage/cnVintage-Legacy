Installation
============

### 1. Prepare dependency
#### For Ubuntu
Install `xvfb`, `graphicsmagick`， `imagemagick` and `wkhtmltox` from Ubuntu repositery.
```
sudo apt install xvfb graphicsmagick imagemagick wkhtmltox -y
```
And then install `node` from binary release. Make sure `node`, `npm` and `wkhtmltoimage` can be found in `$PATH`.
```
cd /tmp
wget https://nodejs.org/dist/v7.4.0/node-v7.4.0-linux-x64.tar.xz
# Manually setup this xz package.
```
#### For Arch Linux
Simply just:
```
sudo pacman -S xorg-server-xvfb nodejs npm wkhtmltopdf graphicsmagick imagemagick
```

### 2. Clone this repositery and install node dependency
``` bash
git clone https://github.com/cnVintage/cnVintage-Legacy.git
cd cnVintage-Legacy
npm i
```

### 3. Edit config file
``` bash
cp config.sample.js config.js
vi config.js
```

### 4. Create a systemd unit
``` bash
echo "
[Unit]
Description=Legacy version of cnVintage.org.

[Service]
WorkingDirectory=$(pwd)
ExecStart=$(which node) $(pwd)/index.js

[Install]
WantedBy=multi-user.target
" | sudo tee /lib/systemd/system/cnvtg-legacy.service
```

### 5. Start the server and enable it to be started on startup.
```
sudo systemctl enable cnvtg-legacy.service
sudo systemctl start cnvtg-legacy.service
```