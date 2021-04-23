const courses = [
	{
		id: 1,
		name: "Boeuf bourguignon",
		picture: "https://img-3.journaldesfemmes.fr/pzy8dfB0qvSphVB8vS3OMzroUlk=/748x499/smart/5a38847db707499bac07bb73dbab72f2/recipe-jdf/10012212.jpg",
		price: 1590,
		description: "Avec sa viande de boeuf ultra fondante et sa sauce au vin rouge, le boeuf bourguignon fait la part belle aux produits de son terroir.",
		cuisine: [
			"french"
		],
		popular: false,
		rating: null,
		rating_total: null,
		rating_voters: 0,
	},
	{
		id: 2,
		name: "Chili Noodle Soup",
		picture: "foodiesfeed.com_chili-noodle-soup-with-fresh-vegetables-on-top (Small).jpg",
		price: 1250,
		description: "Soupe de noodle végetarienne légèrement épicée.",
		cuisine: [
			"asian",
			"spicy"
		],
		popular: true,
		rating: 450,
		rating_total: 9,
		rating_voters: 2,
	},
	{
		id : 3,
        name: 'mafé',
        picture: 'https://img.cuisineaz.com/660x660/2013-12-20/i99447-photo-de-mafe.jpg',
        price : 1250,
        description : 'Le mafé ou tiga dèguè na est une sauce à base de pâte d\'arachide originaire du Mali notamment du peuple mandingue, consommée dans toute une partie de l\'Afrique subsaharienne.',
        cuisine : [
            'african',
            'spicy'
        ],
        popular: true,
        rating: 450,
        rating_total: 9,
        rating_voters: 2,

	}
]

const categories = [
	"french",
	"oriental",
	"asian",
	"spicy"
]

module.exports={
    courses,
    categories /* categories:categories */
}