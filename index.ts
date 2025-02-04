export default function getRandomNumber(): void {
  const randomNumber = 1 + Math.floor(Math.random() * 1000);
  console.log(randomNumber);
}

getRandomNumber();
