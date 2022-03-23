import { Request, Response } from 'express'
import shortid from 'shortid'
import { URLModel } from '../model/URL';
import { config } from '../config/Constants';

export class URLController {
    public async shorten(req:Request, res:Response):Promise<void>{
        const { originUrl } = req.body;
        const url = await URLModel.findOne({ originUrl});
        
        if (url) { res.json(url); return;}

        const hash = shortid.generate();
        const shortURL = `${config.API_URL}/${hash}`;
        
        const newURL = URLModel.create({ originUrl, hash, shortURL });

        res.json(newURL);
    }

    public async redirect(req:Request, res:Response): Promise<void>{
        const { hash } = req.params;
        const url = await URLModel.findOne({ hash });
        
        if(url) { 
            res.redirect(`${url}`); 
            return;
        }

        res.status(400).json({error: 'URL not found'});
    }
}