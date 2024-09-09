

export const capitalNameCommon=(e,setName,notifyAlertCharacter,capitalizeFirstLetters)=> {
    
    const handleName = () => {
        let trimmedValue = e.target.value?.trim();
        let pattern = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;
        const capitalizedText = capitalizeFirstLetters(e.target.value);
        if (!pattern.test(trimmedValue) && trimmedValue != "") {
          if ((e.target.value).includes('  ')) {
            setName(capitalizedText?.replace(/\s+/g, ' '));
          } else {
            notifyAlertCharacter()
          }
        } else {
          if (trimmedValue == "") {
            setName("");
          } else {
            if ((e.target.value).includes('  ')) {
              setName(capitalizedText?.replace(/\s+/g, ' '));
            } else {
              setName(capitalizedText);
            }
          }
        }
      };
      handleName()
      
 
}

