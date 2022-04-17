export interface Reading {
    sensor_ID: string,
    sensor_name?: string, //? means optional
    // carbon_dioxide?: number,
    // carbon_monoxide?: number,
    humidity?: number,
    particulate_matter?: number,
    temperature?: number,
    createdAt: string,
    readingTime: string
}