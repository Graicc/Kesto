import * as fs from "fs";
import * as path from "path";

const configCache: ServerConfig[] = [];

export function ServerConfigFromID(ID: string) : ServerConfig{
    for(const config of configCache){
        if(config.ID === ID) return config;
    }
    const newConfig = new ServerConfig(ID);
    configCache.push(newConfig);
    return newConfig;
}

export class ServerConfig{
    ID: string;

    LogChannel: string = "";
    GKZAdminRole: string = "";

    constructor(ID: string){
        
        this.ID = ID;
        const configPath = path.join(__dirname, "../config");

        if(!fs.existsSync(configPath)) fs.mkdirSync(configPath);
        if(!fs.existsSync(path.join(configPath, ID))) fs.mkdirSync(path.join(configPath, ID));

        if(fs.existsSync(path.join(configPath, ID, "config.json"))){
           // the config exists. no need to make a new config, just load this one. 
           this.Load();
        }else{
            // new config
            this.Save();
        }
    }

    Save(){
        const configPath = path.join(__dirname, "../config", this.ID, "config.json");
        if(fs.existsSync(configPath)) this.Backup();
        fs.writeFileSync(configPath, JSON.stringify(this, null, 2));
    }

    Load(){
        const configPath = path.join(__dirname, "../config", this.ID, "config.json");
        // todo: backup logic
        const LoadedObject = JSON.parse(fs.readFileSync(configPath).toString());
        this.LogChannel = LoadedObject.LogChannel;
        this.GKZAdminRole = LoadedObject.GKZAdminRole;
    }

    Backup(){
        const configPath = path.join(__dirname, "../config", this.ID, "config.json");
        const backupConfigPath = path.join(__dirname, "../config-backups");
        if(!fs.existsSync(backupConfigPath)) fs.mkdirSync(backupConfigPath);
        if(!fs.existsSync(path.join(backupConfigPath, this.ID))) fs.mkdirSync(path.join(backupConfigPath, this.ID));
        fs.copyFileSync(configPath, path.join(backupConfigPath, this.ID, `config-${Date.now()}.json`));
    }
}
