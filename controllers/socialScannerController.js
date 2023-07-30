const { spawn } = require('child_process');
const rl = require('readline');
const whitelist = new Set();
whitelist.add('roylisto');

module.exports = {
  search: (req, res) => {
    if (whitelist.has(req.params.name)) {
      res.send('No result');
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // add -a for full set, otherwise it just using 500 top list
    const maigret = spawn('maigret', [req.params.name]);
    const linereader = rl.createInterface(maigret.stdout, maigret.stdin);

    linereader.on('line', (data) => {
      if (!data.includes("Checking username") && !data.includes("[-] ")
        && !data.includes("[!]") && !data.includes("[?]")) {
        let row = data.replace('[+]', '').replace('┣╸', '-').replace('┗╸', '-').trim();
        if (row) {
          res.write(row+"\n");
        }
      }
    });

    linereader.on('error', (error) => {
      res.write(error);
    });

    linereader.on('close', () => {
        res.end();
    });
  },
  syncJson: (req, res) => {
    // add -a for full set, otherwise it just using 500 top list
    // --top-sites: Count of sites for scan ranked by Alexa Top (default: 500)
    const maigret = spawn('maigret', [req.params.name, '--top-sites', '10']);
    const linereader = rl.createInterface(maigret.stdout, maigret.stdin);
    const results = [];

    linereader.on('line', (data) => {
      if (!data.includes("Checking username") && !data.includes("[-] ")
        && !data.includes("[!]") && !data.includes("[?]")) {
        let row = data.replace('[+]', '').replace('┣╸', '-').replace('┗╸', '-').trim();
        if (row) {
          console.log(row);
          results.push(row);
        }
      }
    });

    linereader.on('error', (error) => {
      res.json({error: 'There is something wrong, please contact administrator', data: []});
    });

    linereader.on('close', () => {
      res.json({error:null, data: results});
    });
  },
  upgrade: (req, res) => {
    const pip3 = spawn('pip3', ['install', 'maigret', '-U']);
    const linereader = rl.createInterface(pip3.stdout, pip3.stdin);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    linereader.on('line', (data) => {
      res.write(data+"\n");
    });

    linereader.on('error', (error) => {
      res.write(error);
    });

    linereader.on('close', () => {
        res.end();
    });
  },
}
