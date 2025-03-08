interface HeaderProps {
  name: string;
}

export default function Header({ name }: HeaderProps) {
  return (
    <header>
      <h1>{name}</h1>
    </header>
  );
}
