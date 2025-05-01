'use client';
import { createTheme } from '@mui/material';
import type {} from '@mui/material/themeCssVarsAugmentation';

const lightMensTheme = createTheme({
  palette: {
    background: {
      default: 'lightblue',
      paper: '#EEEEF9',
    },
  },
});

const darkMensTheme = createTheme({
  palette: {
    background: {
      default: 'navy',
      paper: '#112E4D',
    },
  },
});

const lightWomensTheme = createTheme({
  palette: {
    background: {
      default: 'fuchsia',
      paper: '#EEEEF9',
    },
  },
});

const darkWomensTheme = createTheme({
  palette: {
    background: {
      default: 'purple',
      paper: '#112E4D',
    },
  },
});

export const customTheme = createTheme({
palette: {
  primary: {
    main: '#2A4364',
    // default: '#2A4364',
    // paper: '#112E4D',
  },
  background: {
  },
},

  // colorSchemes: {
  //   light: {
  //     palette: {
  //       primary: {
  //         main: '#2A4364',
  //         // default: '#2A4364',
  //         // paper: '#112E4D',
  //       },
  //     },
  //   },
  //   dark: {
  //     palette: {
  //       primary: {
  //         main: '#F9F9FE',
  //         // default: '#F9F9FE',
  //         // paper: '#EEEEF9',
  //       },
  //     },
  //   },
  // },
//     // lightmen: {
//     //   palette: {
//     //     background: {
//     //       default: 'lightblue',
//     //       paper: '#112E4D',
//     //     },
//     //   }
//     // },
//     // lightwomen: {
//     //   background: {
//     //     default: 'fuhsia',
//     //     paper: '#112E4D',
//     //   },
//     // },
//     // darkmen: {
//     //   background: {
//     //     default: 'navy',
//     //     paper: '#112E4D',
//     //   },
//     // },
//     // darkwomen: {
//     //   background: {
//     //     default: 'purple',
//     //     paper: '#112E4D',
//     //   },
//     // },
//   },
 });