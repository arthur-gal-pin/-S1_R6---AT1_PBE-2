import createMulter from "../configs/produto.multer";

const uploadImage = createMulter({
    folder: 'produtos/imagens',
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    fileSize: 5 * 1024 * 1024 // 5MB
});

export default uploadImage;