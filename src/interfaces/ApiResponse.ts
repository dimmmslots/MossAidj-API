interface Poin {
    pertemuan: string;
    nim: string;
    poin: string;
}

interface getPoinByKodePertemuanResponse {
    kelas: string;
    makul: string;
    pertemuan: string;
    quiz: string;
    data: Poin[];
}

interface failedResponse {
    message: string;
}

export {
    Poin,
    getPoinByKodePertemuanResponse,
    failedResponse
}

