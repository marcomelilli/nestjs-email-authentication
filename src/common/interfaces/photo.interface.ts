// success: true => message, data
// success: false => errorMessage, error

export interface Photo{
  url: string;
  description: string;
  tags: string[];
  date: Date;
}