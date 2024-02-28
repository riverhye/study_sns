interface ImageComponentProps {
  imageUrl: string | null;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ imageUrl }) => {
  if (!imageUrl) {
    return null;
  }
  return (
    <div>
      <img src={imageUrl} alt="profile" width={300} height={300} />
    </div>
  );
};

export default ImageComponent;
