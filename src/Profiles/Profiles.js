const httpPrefix = 'http';
export const ApiProfile = {
    Dev: `${httpPrefix}://localhost:9000/customer-feedback/api/v1/`,
    Test: `${httpPrefix}://172.20.1.38:8080/customer-feedback/api/v1/`,
    UAT: `${httpPrefix}://172.20.1.38:8080/customer-feedback/api/v1/`,
    Prod: 'https://corpapps.rabbitandtortoise.com/customer-feedback/api/v1/'
}

export const getActivProfile = (profile) => {
    switch (profile) {
        case 'Dev': return (ApiProfile.Dev);
        case 'Test': return (ApiProfile.Test);
        case 'UAT': return (ApiProfile.UAT);
        case 'Prod': return (ApiProfile.Prod);
        default: return (ApiProfile.Dev);
    }
}
