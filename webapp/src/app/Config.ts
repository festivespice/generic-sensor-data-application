export interface Config{
    sensor_name?: string,
    sensor_ID: string, //sensor ID is the only required item
    user_ID?: string, 
    // carbon_dioxide_interval?: number,
    // carbon_monoxide_interval?: number,
    humidity_interval?: number,
    particulate_matter_interval?: number,
    temperature_interval?: number,
    // carbon_dioxide_upper_condition?: number,
    // carbon_monoxide_upper_condition?: number,
    humidity_upper_condition?: number,
    humidity_lower_condition?: number,
    particulate_matter_upper_condition?: number,
    temperature_upper_condition?: number,
    temperature_lower_condition?: number
}