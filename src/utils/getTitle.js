export const getTitle = (data) => {
    try {
        let lastElement = data.split('/')[data.split('/').length - 1]
        return lastElement.charAt(0).toUpperCase() + lastElement.slice(1);
      
    } catch (error) {
        console.log(error)
    }

}