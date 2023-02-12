const config = require("./config")
const request = require('request');
const cheerio = require("cheerio");
const { Client, Events, GatewayIntentBits,EmbedBuilder  } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady,async c => {
  
client.user.setStatus("dnd")
	console.log(`${c.user.tag} online!`);
    let a = await getirDepremler()   
let last = a[0]
console.log(last)
setInterval(async () => {
    let x1 = await getirDepremler()   
    if(!x1)return
    if(x1 === undefined)return
//    if(x1[0].timestamp === undefined)return
console.log(x1[0])
if(last.timestamp >= x1[0].timestamp)return
last = x1[0]
    let b = last.sehir
    if(!b.startsWith("("))b = ""
let buyuklukEmoji
if(Number(last.buyukluk) < 10.0)buyuklukEmoji="🔴"
if(Number(last.buyukluk) < 6.0)buyuklukEmoji="🟡"
if(Number(last.buyukluk) < 4.0)buyuklukEmoji="🟢"

    const depremEmbed = new EmbedBuilder()
	.setColor("BLACK")
    .setThumbnail(client.user.avatarURL())
    .setFooter('Depremden etkilenen herkese geçmiş olsun...', client.user.avatarURL())
	.setTitle('Yeni Deprem!')
	.setURL('http://www.koeri.boun.edu.tr/scripts/lst0.asp')
    .setDescription("**"+last.yer+" "+b+"**")
    .addFields(
		{ name: 'Büyüklük', value: buyuklukEmoji+' **'+last.buyukluk+"**", inline: true },
		{ name: 'Derinlik', value: "**"+last.derinlik+"** km", inline: true },
        { name: 'Tarih', value: "<t:"+last.timestamp+":f> (<t:"+last.timestamp+":R>)" },
	)

client.channels.cache.get(config.kanalId).send({embeds:[depremEmbed]})

}, 1*60000);

});
class Deprem {
    constructor(tarih, saat, timestamp, enlem, boylam, derinlik, buyukluk, yer, sehir) {
        this.tarih = tarih;
        this.saat = saat;
        this.timestamp = timestamp;
        this.enlem = enlem;
        this.boylam = boylam;
        this.derinlik = derinlik;
        this.buyukluk = buyukluk;
        this.yer = yer;
        this.sehir = sehir;
    }
}
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
async function getirDepremler() {
    var depremler = []; 
   await request("http://www.koeri.boun.edu.tr/scripts/lst0.asp", async(error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const response = $("pre").text();
            var result = response.split("\n");
            result = result.splice(6, result.length + 1);
           await result.forEach(element => {
                var depremString = element.split(" ");
                var depremBilgi = [];
                for (var i = 0; i < depremString.length; i++) {
                    if (depremString[i].length > 0) {
                        depremBilgi.push(depremString[i]);
                    }
                }

                var tarih = depremBilgi[0];
                var saat = depremBilgi[1];
                var enlem = depremBilgi[2];
                var boylam = depremBilgi[3];
                var derinlik = depremBilgi[4];
                var buyukluk = depremBilgi[6];
                var yer = depremBilgi[8];
                let sehir = depremBilgi[9]
                let timestamp =  Date.parse(tarih+" "+saat) / 1000

                var deprem = new Deprem(tarih, saat, timestamp, enlem, boylam, derinlik, buyukluk, yer, sehir);
                depremler.push(deprem);
            });
            
            //console.log("Deprem Tarama Islemi Tamamlandi. Deprem Sayisi : " + depremler.length);
            a = true
        }
    })
    await delay(500)
    depremler.sort(function(x, y){
        return y.timestamp - x.timestamp;
    })
    return depremler
}





client.login(config.token);
