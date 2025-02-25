export interface IFile {
    /** Оригінальна назва файлу */
    originalName: string;

    /** Оригінальна назва файлу з розширенням */
    originalFullName: string;

    /** унікальна назва файлу у cloude store */
    fileKey: string;

    /** Розмір файлу в байтах */
    size: number;

    /** розширення файлу */
    extension: string;

    /** Тип файлу */
    mimetype: string;
}
