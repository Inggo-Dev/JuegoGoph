import Sequelize from 'sequelize';
import Global from '../Global';
import { Buffer } from 'buffer';
import OpenAI from "openai";

// EXTRAE LAS CADENAS SEPARADAS POR ;
export function ExtraerCadena(Param) {
  var temp = Param;
  let valores = temp.split(';');
  return valores;
};

// EXTRAE LAS CADENAS SEPARADAS POR |
export function ExtraerCadenaPai(Param) {
  var temp = Param;
  let valores = temp.split('|');
  return valores;
};

// CONEXION A LA BASE DE DATOS
export function ConexionBD(NomBD, UserBD, PwdBD, HostBD, PortBD) {
  var VarBD = NomBD;
  var User = UserBD;
  var Pwd = PwdBD;
  var VarHost = HostBD;
  var VarPort = PortBD;

  const CnxBD = new Sequelize(
    VarBD,
    User,
    Pwd,
    {
      host: VarHost,
      port: VarPort,
      dialect: 'postgres',
      pool: {
        max: 5,
        min: 0,
        require: 30000,
        idle: 10000
      },
      logging: false,
      dialectOptions: {
        timezone: '-05:00' // Colombia timezone: UTC-5
      },
      timezone: '-05:00' // If you want Sequelize to use the same timezone for queries
    }
  );

  return CnxBD;
};

// LEER EL ARCHOV .CFG
export function CadenaConexion(req, res) {

  var fs = require('fs');

  var phcode = req;
  var path = Global.Ruta.Path + 'AppConx/';
  var fileName = path + phcode + '.cfg';
  let data = []


  // Check if the file exists 
  let fileExists = fs.existsSync(fileName, 'utf8');

  // If the file does not exist 
  if (!fileExists) {
    return fileExists;
  } else {
    data = fs.readFileSync(fileName, 'utf8');

    // SEPARAR LA CADENA DONDE HAYA UN ';'
    var datos = data.split(";");

    // PASAR CADA DATO SEPARADO EN UNA VARIABLE
    var vservidor = datos[0].split('@')[1];
    var vdatabase = datos[1].split('@')[1];
    var vusuaraio = datos[2].split('@')[1];
    var vpassword = datos[3].split('@')[1];
    var vpuerto = datos[4].split('=')[1];

    // JUNTAR LAS VARIABLES NDEPENDIENTES A UNA CADENA TIPO JSON
    var jsonString = JSON.stringify({ HostBD: vservidor, NomBD: vdatabase, UserBD: vusuaraio, PwdBD: vpassword, Port: vpuerto })

    // PARSEAR A JSON
    var Respuesta = JSON.parse(jsonString);

    return Respuesta;
  }
};

// CIFRAR
export function Cifrar(passwd) {
  var crypto = require('crypto');
  var hash = crypto.createHash('sha256');
  const code = crypto.createHash('sha256').update(passwd).digest('base64');
  return code;
};

export function CifrarGoph(CdPH) {
  var primera = CdPH.slice(0, 5)
  var segunda = CdPH.slice(5, (CdPH.length))
  var Clave = RandomLetter(7) + segunda + primera + RandomLetter(5)
  return Buffer.from(Clave).toString("base64")
}

export function DescifrarGoph(Valor) {
  var phcode = "";
  if (Valor !== undefined) {
    var SinBuffer = Buffer.from(Valor, "base64").toString("utf8");
    var primero = SinBuffer.substr(7);
    var segundo = primero.substring(0, primero.length - 5);
    var ParteUno = segundo.substring(segundo.length - 5, segundo.length);
    var ParteDos = segundo.substring(0, segundo.length - 5);
    phcode = Buffer.from(ParteUno + "" + ParteDos, "base64").toString("utf8");
    return phcode;
  }
};

export function RandomLetter(cantidad) {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var NumRandom = 0;
  var cadena = ""
  for (var a = 0; a < cantidad; a++) {
    NumRandom = Math.floor(Math.random() * (characters.length - 1)) + 1;
    cadena += characters[NumRandom]
  }
  return cadena
}

export function Randon(max) {
  const randomIndex = Math.floor(Math.random() * max.length);
  return max[randomIndex].id_pregunta;
}

export async function CHATGPT(prompt) {
  return new Promise(async (resolve, reject) => {
    try {
      const openai = new OpenAI({
        apiKey: '',
        organization: 'org-y7fylm1QiFQ9rW2M2w86rkcX',
      });
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: 'Eres un asistente útil.' },
          { role: "user", content: prompt }
        ],
        model: "gpt-4o-mini",
      });
      resolve(completion.choices[0].message)
    } catch (error) {
      reject(error)
      throw error;
    }
  })
} 
