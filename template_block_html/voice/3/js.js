(function() {
  // ★ ここにデータを書くだけでOK
  const lw_pr_voice_3_voiceData = [
    {
      name: "田中 美咲様",
      age: "30代",
      job: "会社員",
      photo: "https://picsum.photos/200/200?random=1",
      alt: "田中様", // altを指定しない場合はnameが使われます
      excerpt: "とても丁寧な対応で、安心してお任せすることができました。想像以上の仕上がりに大満足です...",
      text: "とても丁寧な対応で、安心してお任せすることができました。想像以上の仕上がりに大満足です。nn初めての利用で不安もありましたが、最初のヒアリングから丁寧に対応していただき、こちらの要望を細かく聞いてくださいました。途中経過も随時報告していただけたので、安心して任せることができました。nn仕上がりも想像以上で、細部まで気を配っていただいたことが伝わってきます。友人にも自信を持って勧められるサービスです。本当にありがとうございました。"
    },
    {
      name: "佐藤 健太様",
      age: "40代",
      job: "自営業",
      photo: "https://picsum.photos/200/200?random=2",
      excerpt: "スピーディーな対応と、細かい要望にも応えていただき感謝しています。また利用したいです...",
      text: "スピーディーな対応と、細かい要望にも応えていただき感謝しています。また利用したいです。nn急な依頼にも関わらず、迅速に対応していただきました。こちらの細かい要望にも一つ一つ丁寧に答えていただき、期待以上の結果となりました。nnプロフェッショナルな仕事ぶりと柔軟な対応力に感動しました。次回もぜひお願いしたいと思います。長くお付き合いできるパートナーを見つけられて嬉しいです。"
    },
    {
      name: "鈴木 明子様",
      age: "50代",
      job: "主婦",
      photo: "https://picsum.photos/200/200?random=3",
      excerpt: "初めての利用で不安でしたが、親切に説明していただき安心できました。結果も期待以上でした...",
      text: "初めての利用で不安でしたが、親切に説明していただき安心できました。結果も期待以上でした。nn専門的なことは全く分からない状態でしたが、一から丁寧に説明していただき、とても分かりやすかったです。質問にも快く答えていただき、安心して進めることができました。nn完成したものを見て、本当に驚きました。こんなに素晴らしい仕上がりになるとは思っていませんでした。感謝の気持ちでいっぱいです。"
    },
    {
      name: "高橋 大輔様",
      age: "30代",
      job: "IT企業勤務",
      photo: "https://picsum.photos/200/200?random=4",
      excerpt: "プロフェッショナルな仕事ぶりに感動しました。細部まで気を配っていただき、本当に助かりました...",
      text: "プロフェッショナルな仕事ぶりに感動しました。細部まで気を配っていただき、本当に助かりました。nn技術力の高さはもちろん、提案力も素晴らしかったです。こちらが気づかなかった点も指摘していただき、より良い形に仕上げることができました。nnコミュニケーションもスムーズで、レスポンスも早く、ストレスなく進めることができました。同じ業界で働く者として、そのプロ意識に敬意を表します。"
    },
    {
      name: "伊藤 真由美様",
      age: "20代",
      job: "フリーランス",
      photo: "https://picsum.photos/200/200?random=5",
      excerpt: "コストパフォーマンスも良く、品質も申し分ありません。友人にもぜひ勧めたいと思います...",
      text: "コストパフォーマンスも良く、品質も申し分ありません。友人にもぜひ勧めたいと思います。nn予算に限りがある中で相談させていただきましたが、その範囲内で最大限の価値を提供していただきました。決して妥協することなく、高品質な仕上がりに満足しています。nn今後も継続的にお願いしたいと考えています。周りの友人やビジネスパートナーにも自信を持って紹介できるサービスです。"
    },
    {
      name: "渡辺 隆志様",
      age: "40代",
      job: "経営者",
      photo: "https://picsum.photos/200/200?random=6",
      excerpt: "迅速な対応と高い技術力に驚きました。今後も長くお付き合いしたいと思えるサービスです...",
      text: "迅速な対応と高い技術力に驚きました。今後も長くお付き合いしたいと思えるサービスです。nnこれまで様々なサービスを利用してきましたが、ここまで総合的に優れたところは初めてです。スピード、品質、対応、全てにおいて満足しています。nnビジネスパートナーとして信頼できる方々だと感じました。今後の展開も一緒に考えていきたいと思っています。長期的な関係を築いていきたいです。"
    },
    {
      name: "山本 由紀様",
      age: "30代",
      job: "デザイナー",
      photo: "https://picsum.photos/200/200?random=7",
      excerpt: "細かいニュアンスまで理解していただき、理想通りの仕上がりになりました。大変満足しています...",
      text: "細かいニュアンスまで理解していただき、理想通りの仕上がりになりました。大変満足しています。nn同じクリエイティブ業界で働く身として、その繊細な感性と技術力に感動しました。抽象的な要望も的確に汲み取っていただき、イメージ以上の提案をいただけました。nn打ち合わせも楽しく、制作過程も刺激的でした。プロとして尊敬できる仕事をされていると思います。また次回もぜひお願いします。"
    },
    {
      name: "中村 誠様",
      age: "50代",
      job: "会社役員",
      photo: "https://picsum.photos/200/200?random=8",
      excerpt: "アフターフォローも充実していて、安心して利用できました。次回もぜひお願いしたいです...",
      text: "アフターフォローも充実していて、安心して利用できました。次回もぜひお願いしたいです。nn納品後のサポートも手厚く、些細な質問にも丁寧に対応していただきました。長期的な視点で考えてくださる姿勢に信頼感を持ちました。nn単なる取引先ではなく、本当のパートナーとして付き合える方々だと感じています。今後の事業展開でも相談させていただきたいと考えています。"
    }
  ];

  // HTMLを生成する関数
  function lw_pr_voice_3_generateHTML(section) {
    const swiperWrapper = section.querySelector('.swiper-wrapper');
    if (!swiperWrapper) return;

    // スライドを生成
    const slidesHTML = lw_pr_voice_3_voiceData.map((voice, index) => `
      <div class="swiper-slide">
        <div class="voice-card" data-voice-id="${index}">
          <div class="photo">
            <img loading="lazy" src="${voice.photo}" alt="${voice.alt || voice.name}">
          </div>
          <h3 class="name">${voice.name}</h3>
          <p class="excerpt">${voice.excerpt}</p>
          <div class="more-btn">続きを読む</div>
        </div>
      </div>
    `).join('');

    swiperWrapper.innerHTML = slidesHTML;
  }

  // Swiper初期化
  function lw_pr_voice_3_initSwiper(section) {
    if (typeof Swiper === 'undefined') {
      return;
    }

    const swiperElement = section.querySelector('.voice-swiper');
    if (!swiperElement) return;

    new Swiper(swiperElement, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: section.querySelector('.swiper-pagination'),
        clickable: true,
      },
      navigation: {
        nextEl: section.querySelector('.swiper-button-next'),
        prevEl: section.querySelector('.swiper-button-prev'),
      },
      breakpoints: {
        600: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        900: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }

  // モーダル処理
  function lw_pr_voice_3_initModal(section) {
    const modal = section.querySelector('.lw-pr-voice-3-modal');
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    // カードクリックでモーダル表示（イベント委譲）
    section.addEventListener('click', function(e) {
      const card = e.target.closest('.voice-card');
      if (!card) return;

      const voiceId = parseInt(card.getAttribute('data-voice-id'));
      const data = lw_pr_voice_3_voiceData[voiceId];
      
      if (data) {
        modal.querySelector('.modal-photo img').src = data.photo;
        modal.querySelector('.modal-photo img').alt = data.alt || data.name;
        modal.querySelector('.modal-name').textContent = data.name;
        modal.querySelector('.modal-meta').textContent = `${data.age} / ${data.job}`;
        modal.querySelector('.modal-text').textContent = data.text;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    // モーダルを閉じる
    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // ESCキーで閉じる
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // 各セクションを初期化
  function lw_pr_voice_3_initSection(section) {
    // 1. HTMLを生成
    lw_pr_voice_3_generateHTML(section);
    
    // 2. Swiper初期化
    lw_pr_voice_3_initSwiper(section);
    
    // 3. モーダル処理初期化
    lw_pr_voice_3_initModal(section);
  }

  // 全てのセクションを初期化
  function lw_pr_voice_3_initAllSections() {
    const sections = document.querySelectorAll('.lw-pr-voice-3');
    sections.forEach(section => {
      lw_pr_voice_3_initSection(section);
    });
  }

  // 初期化実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (typeof Swiper !== 'undefined') {
        lw_pr_voice_3_initAllSections();
      } else {
        const initWhenReady = function() {
          if (typeof Swiper !== 'undefined') {
            lw_pr_voice_3_initAllSections();
          }
        };
        window.addEventListener('lw:swiperReady', initWhenReady);
        document.addEventListener('lw:swiperReady', initWhenReady);
      }
    });
  } else {
    if (typeof Swiper !== 'undefined') {
      lw_pr_voice_3_initAllSections();
    } else {
      const initWhenReady = function() {
        if (typeof Swiper !== 'undefined') {
          lw_pr_voice_3_initAllSections();
        }
      };
      window.addEventListener('lw:swiperReady', initWhenReady);
      document.addEventListener('lw:swiperReady', initWhenReady);
    }
  }
})();