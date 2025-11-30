declare module 'react-native-image-picker' {
  export interface Asset {
    uri?: string;
  }

  export interface ImageLibraryOptions {
    mediaType?: 'photo' | 'video' | 'mixed';
    selectionLimit?: number;
    quality?: number;
  }

  export interface ImageLibraryResponse {
    assets?: Asset[];
    didCancel?: boolean;
    errorCode?: string | number;
  }

  export function launchImageLibrary(
    options: ImageLibraryOptions,
    callback: (response: ImageLibraryResponse) => void,
  ): void;
}

