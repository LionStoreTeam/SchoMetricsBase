import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FloatingNavAdmin } from "../../components/FloatingNavAdmin"
import { BulkUserUploader } from "./components/BulkUserUploader"
import ManualFormCreateUser from "./components/ManualFormCreatUser"
import ExampleFilesDownloadable from "./components/ExampleFilesDownloadable"

export default function RegisterPage() {


    const exampleDataListStudent = [
        {
            name: "Marco Antonio",
            matricula: "20250001",
            password: "EcoPassGeneracion2025",
            confirmPassword: "EcoPassGeneracion2025",
            userType: "STUDENT"

        },
        {
            name: "José López",
            matricula: "20250002",
            password: "EcoPassGeneracion2025",
            confirmPassword: "EcoPassGeneracion2025",
            userType: "STUDENT"

        },
        {
            name: "Lucía Ramírez",
            matricula: "20250003",
            password: "EcoPassGeneracion2025",
            confirmPassword: "EcoPassGeneracion2025",
            userType: "STUDENT"

        }
    ]
    const exampleDataListTeacher = [
        {
            name: "Luis Navarro",
            matricula: "DC250001",
            password: "EcoPassGeneracion2025",
            confirmPassword: "EcoPassGeneracion2025",
            userType: "TEACHER"
        },
        {
            name: "Gabriela Jiménez",
            matricula: "DC250002",
            password: "EcoPassGeneracion2025",
            confirmPassword: "EcoPassGeneracion2025",
            userType: "TEACHER"
        },
        {
            name: "Isabela Mendoza",
            matricula: "DC250003",
            password: "EcoPassGeneracion2025",
            confirmPassword: "EcoPassGeneracion2025",
            userType: "TEACHER"
        },
    ]


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
            <div className="flex flex-col justify-center items-center">
            </div>
            <FloatingNavAdmin />
            <div className="w-auto lg:w-[800px] xl:w-[1000px] xl:p-10 my-5 p-3 flex flex-col justify-center items-center gap-4 rounded-xl">
                <h1 className="text-teal-600 text-4xl font-bold text-center">Carga Manual de Nuevos Usuario</h1>
                <p className="text-teal-600 text-xl text-balance text-center">
                    Crea nuevos Usuarios de manera individual para SchoMetrics.
                </p>
                <ManualFormCreateUser />
            </div>

            <div className="w-full lg:w-[800px] xl:w-[1000px] xl:p-10 my-5 p-3 bg-transparent flex flex-col justify-center items-center gap-4 rounded-xl">
                <h1 className="text-4xl font-bold text-center text-blue-500">Carga Masiva de Nuevos Usuario</h1>
                <span className="text-xl text-balance text-center text-blue-500">
                    Pudes cargar achivos tipo {" "}
                    <b>
                        [ .csv, .xlsx, .xls ]
                    </b>
                </span>

                <BulkUserUploader />

                <div className=" w-full flex flex-col justify-center items-center text-center">
                    <div className="my-3 mb-5 p-3 px-6 border-2 border-dashed border-blue-500 hover:border-dotted rounded-sm">
                        <h2 className="pb-3 text-2xl font-semibold text-blue-900">Descargar Archivos de Ejemplo:</h2>
                        <ExampleFilesDownloadable />
                    </div>
                    <h2 className="text-start px-3 py-1 rounded-md bg-white text-red-500 font-semibold shadow-md">En archivos [.xlsx, .xls ]. Para una correcta aceptación del archivo y el correcto procesamiento en la Base de datos, es obligatorio que la estructura de los datos sea de la siguiente manera: </h2>
                    <div className="w-full">
                        <div className="overflow-x-auto bg-gray-800 my-5 rounded-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center text-slate-100">name</TableHead>
                                        <TableHead className="text-center text-slate-100">matricula</TableHead>
                                        <TableHead className="text-center text-slate-100">password</TableHead>
                                        <TableHead className="text-center text-slate-100">confirmPassword</TableHead>
                                        <TableHead className="text-center text-slate-100">userType</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        exampleDataListStudent.map((data, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-center text-slate-100">{data.name}</TableCell>
                                                <TableCell className="text-center text-slate-100">{data.matricula}</TableCell>
                                                <TableCell className="text-center text-slate-100">{data.password}</TableCell>
                                                <TableCell className="text-center text-slate-100">{data.confirmPassword}</TableCell>
                                                <TableCell className="text-center text-slate-100">{data.userType}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                        <div className="w-full overflow-x-auto bg-gray-800 my-5 rounded-sm">
                            <Table className="my-5">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center text-slate-100">name</TableHead>
                                        <TableHead className="text-center text-slate-100">matricula</TableHead>
                                        <TableHead className="text-center text-slate-100">password</TableHead>
                                        <TableHead className="text-center text-slate-100">confirmPassword</TableHead>
                                        <TableHead className="text-center text-slate-100">userType</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {
                                        exampleDataListTeacher.map((data, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-center text-slate-100">{data.name}</TableCell>
                                                <TableCell className="text-center text-slate-100">{data.matricula}</TableCell>
                                                <TableCell className="text-center text-slate-100">{data.password}</TableCell>
                                                <TableCell className="text-center text-slate-100">{data.confirmPassword}</TableCell>
                                                <TableCell className="text-center text-slate-100">{data.userType}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col justify-center items-center text-center">
                    <h2 className="text-start px-3 py-1 rounded-md bg-white text-red-500 font-semibold shadow-md">En archivos [.csv (Comma Separated Values) ]. Para una correcta aceptación del archivo y el correcto procesamiento en la Base de datos, es obligatorio que la estructura de los datos sea de la siguiente manera: </h2>
                    <div className="w-full overflow-auto mt-5 p-2 rounded-sm bg-gray-800 text-slate-100 flex flex-col justify-center items-start">
                        <span className="text-start font-semibold">
                            name,matricula,password,confirmPassword,userType
                        </span>
                        <span className="text-start">
                            Marco Antonio,20250001,EcoPassGeneracion2025,EcoPassGeneracion2025,STUDENT
                        </span>
                        <span className="text-start">
                            José López,20250002,EcoPassGeneracion2025,EcoPassGeneracion2025,STUDENT
                        </span>
                        <span className="text-start">
                            Lucía Ramírez,20250003,EcoPassGeneracion2025,EcoPassGeneracion2025,STUDENT
                        </span>
                    </div>
                </div>
            </div>
        </div >
    )
}