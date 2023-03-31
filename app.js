const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000',
  parent: 'phaser-example',
  scene: {
    preload: preload,
    create: create
  }
};

const CARD_WIDTH = 45;
const CARD_HEIGHT = 314;
const CARD_SPACING = 5;
const CARD_TWEEN_DURATION = 20;
const CARD_SHOW_DELAY = 20;

const game = new Phaser.Game(config);

function preload() {
  // Load card images
  this.load.image('card1', 'assets/card1.png');
  this.load.image('card2', 'assets/card2.png');
  this.load.image('card3', 'assets/card3.png');
  this.load.image('card4', 'assets/card4.png');
  this.load.image('card5', 'assets/card5.png');
  this.load.image('card-back', 'assets/card-back.png');
}

function create() {
  const cards = [];

  // Generate random cards and position them
  let x = this.cameras.main.centerX - ((CARD_WIDTH + CARD_SPACING) * 5 - CARD_SPACING) / 2;
  const y = this.cameras.main.centerY;
  ['card1', 'card2', 'card3', 'card4', 'card5'].forEach(key => {
    const backCard = this.add.image(x, y, 'card-back').setOrigin(0.5);
    const frontCard = this.add.image(x, y, key).setOrigin(0.5).setAlpha(0);
    cards.push({ front: frontCard, back: backCard });
    frontCard.setScale(0.1);
    backCard.setScale(0.1);
    x += CARD_WIDTH + CARD_SPACING;
  });

  // Tween each card in sequence
  let tweenIndex = 0;
  const tweenNextCard = () => {
    if (tweenIndex < cards.length) {
      const card = cards[tweenIndex];
      const flipTween = this.tweens.add({
        targets: card.back,
        scaleX: 0.1,
        duration: CARD_TWEEN_DURATION / 2,
        onComplete: () => {
          card.front.setAlpha(1);
          const rotateTween = this.tweens.add({
            targets: card.front,
            angle: 0,
            duration: CARD_TWEEN_DURATION / 2,
            onComplete: () => {
              const flipBackTween = this.tweens.add({
                targets: card.front,
                scaleX: 0.1,
                duration: CARD_TWEEN_DURATION / 2,
                onComplete: () => {
                  const rotateBackTween = this.tweens.add({
                    targets: card.front,
                    angle: 0,
                    duration: CARD_TWEEN_DURATION / 2,
                    onComplete: () => {
                      card.back.setAlpha(1);
                      tweenIndex++;
                      this.time.delayedCall(CARD_SHOW_DELAY, tweenNextCard);
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      // Restart the scene after a delay to repeat the animation
      this.time.delayedCall(1000, () => {
        this.scene.restart();
      });
    }
  };

  // Show back of cards first
  cards.forEach(card => {
    card.front.setAlpha(0);
  });

  // Start tweening after a delay
  this.time.delayedCall(1000, tweenNextCard);
}

