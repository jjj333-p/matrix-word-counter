# matrix-word-counter

A simple matrix bot to count how frequently users use a word in your room.

![image](https://github.com/jjj333-p/matrix-word-counter/assets/94018608/fe532ec6-8521-4ab9-9a04-405e4f3aafc2)

# Usage

This bot is very simple, there is one command and for the most part it just sits in the background unnoticed. You can invite my bot `@word-counter:pain.agency` or host it yourself.

- The bot will count the last 1000 fetchable messages uppon joining and counts words from every message since
- The counts are on a per room basis, so you can see just how degenerate your room is!
- Any word fitting the regex `/[^a-z0-9]/gi` will be counted
- Run `.count <word>` to count how many times a word has been said in this room
- Do note, this bot does not support encryption.

# Hosting

### What you need:

- Unix based system (Linux preferred)

    -   The NT kernel is picky about filenames and shit, and we write files with characters that windows may not like. If you are using windows I recommend using WSL or a VPS to run this bot

    - This bot has also only ever been tested on Fedora 39 and Debian 12 

- Git (optional)

- nodejs 

    - This bot is tested to work with node `v20.12.2` and `v18.20.2`
    
    - Most distros will install with `sudo <package manager> install nodejs npm`

    - On Debian stable the Node version included in the repos are ancient and can cause issues. Personally I installed node through snap and use that, but you can also download the binary manually or complile yourself.

- npm

- A Matrix account for the bot to use. You can use curl, or grab your token from element

    - Navigate to Settings > Help & About > Advanced > Access Token

### What to do:

- If using git, clone the directory and cd into it
    ```
    git clone https://github.com/jjj333-p/matrix-word-counter.git
    cd matrix-word-counter
    ```

- Copy the example config file in `example/login.yaml` to `db/login.yaml`
    ```
    mkdir db
    cp example/login.yaml db/login.yaml
    ```

- Follow the commented instructions found in `db/login.yaml`, entering in your homeserver and access token

- Install dependencies by running `npm install`

- Run the bot with `node index.js`

    - `snap run node index.js` for the users using snap

- (Optional) Add to systemd services

    - 