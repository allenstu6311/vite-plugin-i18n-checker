import { ReportType } from "./types";


function getColor(type: ReportType = 'error') {
    switch (type) {
        case 'warning': return 'yellow';
        case 'error': return 'red';
        case 'success': return 'green';
        case 'info': return 'cyan';
    }
}

export {
    getColor
};

