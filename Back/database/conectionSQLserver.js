import mssql from "mssql"

const conectionSetting = {
    server: 'DESKTOP-ON0LU8C',
    database: "Medicall_App",
    user: "sa",
    password: "12345678",
    options: {
        encrypt: true,
        trustServerCertificate: true,
    }
}

export async function getConection(){
    try{
        return mssql.connect(conectionSetting)
    }catch(error){
        console.error(error)
    }
}

export {mssql}