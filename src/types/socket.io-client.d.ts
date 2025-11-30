declare module 'socket.io-client' {
  export interface Socket {
    id?: string;
    on(event: string, callback: (...args: any[]) => void): Socket;
    off(event: string, callback?: (...args: any[]) => void): Socket;
    emit(event: string, ...args: any[]): Socket;
    close(): Socket;
    disconnect(): Socket;
    connect(): Socket;
  }

  export interface SocketOptions {
    query?: Record<string, string>;
    transports?: string[];
    [key: string]: any;
  }

  export default function io(url?: string, options?: SocketOptions): Socket;
}

