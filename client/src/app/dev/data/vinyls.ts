import { Genre } from "@/types/genre";

export interface Vinyl {
  id: number;
  price: number;
  title: string;
  genre: Genre;
  imageUrl: string;
  description: string;
}

export const vinyls: Vinyl[] = [
  {
    id: 1,
    price: 19.99,
    title: "Thriller",
    genre: Genre.Pop,
    imageUrl: "https://draw.acharts.net/cover/16243-54d003bfc4ff0-l.jpg",
    description: "Michael Jackson's iconic album",
  },
  {
    id: 2,
    price: 14.99,
    title: "Abbey Road",
    genre: Genre.Rock,
    imageUrl:
      "https://www.nme.com/wp-content/uploads/2019/09/BEATLES_ABBEY_ROAD_2000-1392x884.jpg",
    description: "The Beatles' classic album",
  },
  {
    id: 3,
    price: 9.99,
    title: "Back in Black",
    genre: Genre.Rock,
    imageUrl:
      "https://gcdn.emol.cl/los-80/files/2020/11/ACDC-back-in-black-album.jpg",
    description: "AC/DC's iconic album",
  },
  {
    id: 4,
    price: 12.99,
    title: "The Dark Side of the Moon",
    genre: Genre.Rock,
    imageUrl:
      "https://mediaproxy.salon.com/width/1200/https://media.salon.com/2023/03/the_dark_side_of_the_moon_album_cover_74290244.jpg",
    description: "Pink Floyd's masterpiece",
  },
  {
    id: 5,
    price: 8.99,
    title: "Nevermind",
    genre: Genre.Rock,
    imageUrl:
      "https://360radio.com.co/wp-content/uploads/2016/09/Wallpapersxl-Nirvana-Nevermind-Free-For-Never-Mind-Hd-Xpx-With-182844-1600x1200.jpg",
    description: "Nirvana's breakthrough album",
  },
  {
    id: 6,
    price: 7.99,
    title: "Purple Rain",
    genre: Genre.Pop,
    imageUrl:
      "https://image.tmdb.org/t/p/original/gi8CJcDoZJc9o1nuOFccAXpRdTH.jpg",
    description: "Prince's iconic album",
  },
  {
    id: 7,
    price: 11.99,
    title: "Songs in the Key of Life",
    genre: Genre.Soul,
    imageUrl:
      "https://cdn.hmv.com/r/w-960/hmv/files/0b/0b147e64-d7d1-417e-b44f-84bd6a0e0b9d.jpg",
    description: "Steview Wonder's classic album",
  },
  {
    id: 8,
    price: 6.99,
    title: "Rumours",
    genre: Genre.Rock,
    imageUrl: "https://www.earcandymag.com/fleetwordmachoovers-1120.jpg",
    description: "Fleetwood Mac's timeless album",
  },
  {
    id: 9,
    price: 10.99,
    title: "Tiro de Misericordia",
    genre: Genre.Latin,
    imageUrl:
      "https://mesvinyles.fr/91848-medium_default/joao-bosco-tiro-de-misericordia-lp-album.jpg",
    description: "João Bosco's classic album",
  },
  {
    id: 10,
    price: 13.99,
    title: "Headhunters",
    genre: Genre.Jazz,
    imageUrl:
      "https://i.discogs.com/Bng85Q1pBPWZmqsBJt9EGHOe89Y_4EBfpU6IuDPaI9A/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI5MjMx/NTctMTQ1Mjc3MzQ1/MS00MzMxLmpwZWc.jpeg",
    description:
      "Herbie Hancock's classic album that defined jazz-funk with its iconic cover art and groundbreaking music. Utilizing a minimalist approach to jazz-funk, the album is a stark contrast to Hancock's previous work, which was more orchestral in nature. The album's title track, 'Chameleon,' is a prime example of this new direction, with its repetitive bassline and synthesizer-driven melody. The album also features the hit 'Watermelon' and the funky 'Sly,' which showcases Hancock's virtuosic keyboard skills. 'Head Hunters' is a landmark album in the history of jazz and remains a classic of the genre to this day.",
  },
  {
    id: 11,
    price: 15.99,
    title: "Hotel California",
    genre: Genre.Rock,
    imageUrl:
      "https://images.squarespace-cdn.com/content/v1/565c1ab5e4b05079e4bfa169/1617779080542-R47YFNGDV8UYXXOOHEDR/Eagles+Hotel+California+Vinyl+Cover+Art.jpg",
    description: "Eagles' iconic album",
  },
  {
    id: 12,
    price: 9.99,
    title: "To Pimp a Butterfly",
    genre: Genre.HipHop,
    imageUrl:
      "https://factmag-images.s3.amazonaws.com/wp-content/uploads/2015/08/TPAB.png",
    description:
      "Kendrick Lamar's critically acclaimed album that explores the black experience in America and features a mix of jazz, funk, and spoken word elements. The album's themes are complex and thought-provoking.",
  },
  {
    id: 13,
    price: 12.99,
    title: "Appetite for Destruction",
    genre: Genre.Rock,
    imageUrl:
      "https://imagine-club.com/sites/default/files/styles/product_zoom/public/photos/appetite_for_destruction_guns_n_roses_1_cd_universal_eu.jpg?itok=Psq8d1do",
    description: "Guns N' Roses' debut album",
  },
  {
    id: 14,
    price: 8.99,
    title: "The Chronic",
    genre: Genre.HipHop,
    imageUrl:
      "https://2.bp.blogspot.com/-SMQHqO6ti3I/Uq3b5vvAcgI/AAAAAAAACZc/Ts2oT1Qc-aQ/s1600/the-chronic-4ea687eb81068.jpg",
    description: "Dr. Dre's influential album",
  },
  {
    id: 15,
    price: 7.99,
    title: "Led Zeppelin IV",
    genre: Genre.Rock,
    imageUrl:
      "https://s.yimg.com/ny/api/res/1.2/YTzN0ElXoWTX20hHUgw_kg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTk4Ng--/https://media.zenfs.com/en/music_feeds_654/f6d731d65f55278a7cc1f518f6e1e327",
    description: "Led Zeppelin's classic album",
  },
  {
    id: 16,
    price: 11.99,
    title: "Aja",
    genre: Genre.Rock,
    imageUrl:
      "https://i1.wp.com/musicaficionado.blog/wp-content/uploads/2020/09/Steeley-Dan-Aja-front.png?resize=1024%2C1024&ssl=1",
    description: "Steely Dan's classic album",
  },
  {
    id: 17,
    price: 6.99,
    title: "Matti Caspi",
    genre: Genre.Rock,
    imageUrl: "https://matticaspi.co.il/wp-content/uploads/first.jpg",
    description: "Matti Caspi's classic album",
  },
  {
    id: 18,
    price: 10.99,
    title: "Pet Sounds",
    genre: Genre.Rock,
    imageUrl:
      "https://returnofrock.com/wp-content/uploads/2021/09/Pet-Sounds-1280x765.jpg",
    description: "The Beach Boys' masterpiece",
  },
  {
    id: 19,
    price: 13.99,
    title: "OK Computer",
    genre: Genre.Rock,
    imageUrl:
      "https://www.elindependiente.com/wp-content/uploads/2017/08/ok-computer-revisited.jpg",
    description: "Radiohead's groundbreaking album",
  },
  {
    id: 20,
    price: 15.99,
    title: "AOR",
    genre: Genre.Funk,
    imageUrl: "https://f4.bcbits.com/img/a2674541618_10.jpg",
    description: "Ed motta's classic album, a mix of jazz, funk, and soul.",
  },
  {
    id: 21,
    price: 9.99,
    title: "The Miseducation of Lauryn Hill",
    genre: Genre.HipHop,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/5/55/LaurynHillTheMiseducationofLaurynHillalbumcover.jpg",
    description: "Lauryn Hill's critically acclaimed album",
  },
  {
    id: 22,
    price: 12.99,
    title: "George Gershwin's Rhapsody in Blue",
    genre: Genre.Classical,
    imageUrl:
      "https://i.discogs.com/qh12cY8VmD8mISGEPrHHao4kq4wFWAo2yf99g9irNHM/rs:fit/g:sm/q:90/h:500/w:500/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTU3Nzkw/ODEtMTQ1OTM1MTI2/OS05MjQzLmpwZWc.jpeg",
    description:
      "George Gershwin's iconic composition performed by the New York Philharmonic Orchestra. The piece is a fusion of classical music and jazz, and is considered one of the most important works of American music. The piece was composed in 1924 and premiered in New York City in 1924. It has since become a staple of the classical music repertoire and is widely regarded as one of the greatest works of the 20th century. The piece is known for its distinctive opening clarinet glissando, which has become one of the most recognizable motifs in classical music. The piece is a landmark in American music and has been performed by countless orchestras around the world.",
  },
];
