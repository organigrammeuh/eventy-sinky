export const toSnakeCase = (chars : string) => {
    let snakeCase = '';

    for(const char of chars){
        if(snakeCase.trim()== ''){
            snakeCase += char.toLowerCase();
        } 
        else {
            if(char == char.toUpperCase()){
                snakeCase += '_' + char.toLowerCase();
            } else {
                snakeCase += char;
            }
        }
    }

    return snakeCase
}