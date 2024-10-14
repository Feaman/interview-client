import Konva from 'konva'
import { Stage } from 'konva/lib/Stage'
import { isCandidateLoading } from '~/composables'
import { getCrop } from '~/helpers/canvas'
import CandidateModel, { TCandidate } from '~/models/candidate-model'
import BaseService, { TGlobalError } from '~/services/base-service'
import { t } from './translate'

export default class CandidateService extends BaseService {
  static async update(candidate: CandidateModel | FormData) {
    let candidateData
    try {
      isCandidateLoading.value = true
      const isFormData = candidate instanceof FormData
      if (!isFormData) {
        candidate.data = JSON.stringify(candidate.questions)
      }
      const candidateId = isFormData ? candidate.get('id') : candidate.id
      const response = await this.api.put(`candidates/${candidateId}`, candidate)
      candidateData = response.data
      isCandidateLoading.value = false
    } catch (error) {
      this.handleError(error as TGlobalError)
    }
    return new CandidateModel(candidateData)
  }

  static async create(formData: FormData): Promise<CandidateModel> {
    let candidateData
    try {
      isCandidateLoading.value = true
      const response = await this.api.post('candidates', formData)
      candidateData = response.data
      isCandidateLoading.value = false
    } catch (error) {
      this.handleError(error as TGlobalError)
    }
    return new CandidateModel(candidateData as TCandidate)
  }

  static async remove(candidate: CandidateModel) {
    try {
      isCandidateLoading.value = true
      await this.api.delete(`candidates/${candidate.id}`)
      isCandidateLoading.value = false
    } catch (error) {
      this.handleError(error as TGlobalError)
    }
  }

  static async generateReport(
    $container: HTMLDivElement | null,
    candidate: CandidateModel,
    width?: number,
  ): Promise<Stage> {
    const stage = new Konva.Stage({
      container: $container as HTMLDivElement,
      width: width || $container?.offsetWidth,
    })

    const layer = new Konva.Layer()
    const avatarWidth = 140
    let currentY = 20

    // BACKGROUND
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: stage.width(),
      height: stage.height(),
      fill: 'white',
      preventDefault: false,
    })
    layer.add(background)

    // AVATAR
    if (candidate.photoPath) {
      const avatarImage = await this.getAvatarImage(candidate.photoPath)
      const circle = new Konva.Circle({
        x: stage.width() / 2,
        y: currentY + avatarWidth / 2 + 4,
        radius: avatarWidth / 2 + 4,
        stroke: '#4a148c',
        strokeWidth: 4,
        fill: 'white',
        preventDefault: false,
      })
      layer.add(circle)
      const currentYCopy = currentY
      const avatar = new Konva.Image({
        x: stage.width() / 2 - avatarWidth / 2,
        y: currentYCopy + 4,
        cornerRadius: avatarWidth / 2,
        image: avatarImage,
        width: avatarWidth,
        height: avatarWidth,
        preventDefault: false,
      })
      const crop = getCrop(
            avatar.image() as HTMLImageElement,
            { width: avatar.width(), height: avatar.height() },
      )
      avatar.setAttrs(crop)
      layer.add(avatar)
      currentY += avatarWidth + 12
    }

    // NAME
    const nameTopMargin = 10
    const name = new Konva.Text({
      x: 20,
      y: currentY + nameTopMargin,
      width: stage.width() - 40,
      text: candidate.getFio(),
      lineHeight: 1.2,
      fontStyle: 'bold',
      fontSize: 40,
      align: 'center',
      fontFamily: 'Roboto',
      fill: '#4a148c',
      preventDefault: false,
    })
    layer.add(name)
    currentY += name.height() + nameTopMargin

    // LEGEND
    const legendTextMargin = 30
    const legendGroup = new Konva.Group({
      x: 0,
      y: currentY + 20,
    })
    let legendX = 0
    const legendRadius = 9
    const legendGreen = new Konva.Circle({
      x: legendX + legendRadius,
      y: 6,
      radius: legendRadius,
      fill: 'green',
      preventDefault: false,
    })
    legendX += legendRadius * 2
    const legendGreenText = new Konva.Text({
      x: legendX + 5,
      y: 0,
      text: t('Good'),
      fontSize: 15,
      fontFamily: 'Roboto',
      preventDefault: false,
    })
    legendX += 5 + legendGreenText.width()
    const legendOrange = new Konva.Circle({
      x: legendX + legendTextMargin,
      y: 6,
      radius: legendRadius,
      fill: 'orange',
      preventDefault: false,
    })
    legendX += legendTextMargin + legendRadius
    const legendOrangeText = new Konva.Text({
      x: legendX + 5,
      y: 0,
      text: t('Average'),
      fontSize: 15,
      fontFamily: 'Roboto',
      preventDefault: false,
    })
    legendX += 5 + legendOrangeText.width()
    const legendRed = new Konva.Circle({
      x: legendX + legendTextMargin,
      y: 6,
      radius: legendRadius,
      fill: 'red',
      preventDefault: false,
    })
    legendX += legendTextMargin + legendRadius
    const legendRedText = new Konva.Text({
      x: legendX + 5,
      y: 0,
      text: t('Bad'),
      fontSize: 15,
      fontFamily: 'Roboto',
      preventDefault: false,
    })
    legendGroup.add(legendGreen)
    legendGroup.add(legendOrange)
    legendGroup.add(legendRed)
    legendGroup.add(legendGreenText)
    legendGroup.add(legendOrangeText)
    legendGroup.add(legendRedText)
    const legendGroupWidth = legendX + 5 + legendRedText.width()
    legendGroup.setAttr('x', (stage.width() - legendGroupWidth) / 2)
    layer.add(legendGroup)
    currentY += 20 + legendGreenText.height()

    // MAIN QUESTIONS
    candidate.questions
      .filter((question) => question.status)
      .forEach((mainQuestion, index) => {
        // MAIN QUESTION
        const mainQuestionTopMargin = index === 0 ? 20 : 40
        const mainQuestionFrame = new Konva.Rect({
          x: 20.5,
          y: currentY + mainQuestionTopMargin + 0.5,
          stroke: '#e0e0e0',
          strokeWidth: 1,
          width: stage.width() - 41,
          cornerRadius: [4, 4, 0, 0],
          fill: '#f5f5f5',
          preventDefault: false,
        })
        const mainQuestionText = new Konva.Text({
          x: 20,
          y: currentY + mainQuestionTopMargin + 17,
          width: stage.width() - 40,
          text: mainQuestion.title.toUpperCase(),
          fontSize: 20,
          align: 'center',
          fontStyle: 'bold',
          fontFamily: 'Roboto',
          fill: mainQuestion.getColorClass(),
          preventDefault: false,
        })
        mainQuestionFrame.setAttr('height', mainQuestionText.height() + 30)

        // MAIN QUESTION COMMENT
        let mainQuestionComment
        if (mainQuestion.comment) {
          mainQuestionComment = new Konva.Text({
            x: 20,
            y: currentY + mainQuestionTopMargin + 50,
            width: stage.width() - 40,
            text: mainQuestion.comment,
            fontSize: 20,
            align: 'center',
            fontFamily: 'Roboto',
            fill: '#999',
            preventDefault: false,
          })
          mainQuestionFrame.setAttr('height', mainQuestionFrame.height() + mainQuestionComment.height() + 5)
        }
        layer.add(mainQuestionFrame)
        layer.add(mainQuestionText)
        if (mainQuestion.comment && mainQuestionComment) {
          layer.add(mainQuestionComment)
        }
        currentY += mainQuestionFrame.height() + mainQuestionTopMargin

        // SUB-QUESTIONS
        const subQuestions = mainQuestion.items
          .filter((subQuestion) => subQuestion.status)
        subQuestions
          .forEach((subQuestion, subQuestionIndex) => {
            // SUB-QUESTION
            const subQuestionFrame = new Konva.Rect({
              x: 20.5,
              y: currentY + 0.5,
              width: stage.width() - 41,
              stroke: '#e0e0e0',
              strokeWidth: 1,
              preventDefault: false,
            })
            if (subQuestionIndex === subQuestions.length - 1) {
              subQuestionFrame.setAttr('cornerRadius', [0, 0, 4, 4])
            }
            const subQuestionText = new Konva.Text({
              x: 40,
              y: currentY + 10,
              width: subQuestionFrame.width() - 80,
              text: subQuestion.title,
              lineHeight: 1.2,
              fontSize: 20,
              fontFamily: 'Roboto',
              fill: subQuestion.getColorClass(),
              preventDefault: false,
            })
            subQuestionFrame.setAttr('height', subQuestionText.height() + 15)

            // SUB-QUESTION COMMENT
            let subQuestionComment
            if (subQuestion.comment) {
              subQuestionComment = new Konva.Text({
                x: 40,
                y: subQuestionText.y() + subQuestionText.height(),
                width: stage.width() - 80,
                text: subQuestion.comment,
                lineHeight: 1.2,
                fontSize: 15,
                fontFamily: 'Roboto',
                fill: '#888',
                preventDefault: false,
              })
              subQuestionFrame.setAttr('height', subQuestionFrame.height() + subQuestionComment.height() + 3)
            }
            layer.add(subQuestionFrame)
            layer.add(subQuestionText)
            if (subQuestion.comment && subQuestionComment) {
              layer.add(subQuestionComment)
            }
            currentY += subQuestionFrame.height()
          })
      })

    const totalHeight = currentY + 20
    stage.height(totalHeight)
    background.height(totalHeight)
    stage.add(layer)

    return stage
  }

  static getAvatarImage(photoPath: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const avatarImage = new Image()
      avatarImage.src = photoPath
      avatarImage.crossOrigin = 'Anonymous'
      avatarImage.onload = () => resolve(avatarImage)
    })
  }
}
