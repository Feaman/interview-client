import Konva from 'konva'
import { Stage } from 'konva/lib/Stage'
import { isCandidateLoading } from '~/composables'
import { getCrop } from '~/helpers/canvas'
import CandidateModel, { TCandidate } from '~/models/candidate-model'
import BaseService, { TGlobalError } from '~/services/base-service'

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

  static async generateReport(candidate: CandidateModel): Promise<Stage> {
    return new Promise((resolve) => {
      // AVATAR IMAGE
      const avatarImage = new Image()
      avatarImage.onload = () => {
        const stage = new Konva.Stage({
          container: 'report',
          width: 900,
          height: 1500,
        })

        const layer = new Konva.Layer()
        const avatarWidth = 140
        let currentY = 0

        // BACKGROUND
        const background = new Konva.Rect({
          x: 0,
          y: 0,
          width: stage.width(),
          height: stage.height(),
          fill: 'white',
        })
        layer.add(background)

        // AVATAR
        const circle = new Konva.Circle({
          x: stage.width() / 2,
          y: 80,
          radius: avatarWidth / 2,
          stroke: 'grey',
          strokeWidth: 1,
          shadowColor: 'black',
          shadowBlur: 5,
          shadowOpacity: 0.8,
        })
        layer.add(circle)
        const avatar = new Konva.Image({
          x: stage.width() / 2 - avatarWidth / 2,
          y: 10,
          image: avatarImage,
          cornerRadius: avatarWidth / 2,
          width: 140,
          height: 140,
        })
        const crop = getCrop(
          avatar.image() as HTMLImageElement,
          { width: avatar.width(), height: avatar.height() },
        )
        avatar.setAttrs(crop)
        layer.add(avatar)
        currentY += avatarWidth + 12

        // NAME
        const name = new Konva.Text({
          x: 0,
          y: currentY + 40,
          width: stage.width(),
          height: 30,
          text: candidate.getFio().toUpperCase(),
          fontSize: 30,
          align: 'center',
          fontFamily: 'Roboto',
        })
        layer.add(name)
        currentY += name.height() + 40

        // MAIN QUESTIONS
        candidate.questions
          .filter((question) => question.status)
          .forEach((question) => {
            // MAIN QUESTION
            const mainQuestionFrame = new Konva.Rect({
              x: 20,
              y: currentY + 10,
              width: stage.width() - 40,
              height: 60,
              cornerRadius: [4, 4, 0, 0],
              fill: '#eee',
            })
            layer.add(mainQuestionFrame)
            const mainQuestionText = new Konva.Text({
              x: 0,
              y: currentY + 25,
              width: stage.width(),
              height: 30,
              text: question.title,
              fontSize: 30,
              align: 'center',
              fontFamily: 'Roboto',
              fill: question.getColorClass(),
            })
            layer.add(mainQuestionText)

            // MAIN QUESTION COMMENT
            if (question.comment) {
              const mainQuestionComment = new Konva.Text({
                x: 0,
                y: currentY + 5,
                width: stage.width(),
                height: 25,
                text: question.comment,
                fontSize: 25,
                align: 'center',
                fontFamily: 'Roboto',
                fill: 'grey',
              })
              layer.add(mainQuestionComment)
            }
            currentY += 60

            // SUB-QUESTIONS
            question.items
              .filter((subQuestion) => subQuestion.status)
              .forEach((subQuestion, index) => {
                // SUB-QUESTION
                const subQuestionFrame = new Konva.Rect({
                  x: 21,
                  y: currentY + 10,
                  width: stage.width() - 42,
                  height: 60,
                  stroke: '#eee',
                  strokeWidth: 1,
                })
                if (index === question.items.length - 1) {
                  subQuestionFrame.setAttr('cornerRadius', [0, 0, 4, 4])
                }
                // const test = new Konva.Rect({
                //   x: 30,
                //   y: currentY + 20,
                //   width: stage.width() - 60,
                //   height: 60,
                //   stroke: 'red',
                //   strokeWidth: 1,
                //   // fill: 'red',
                // })
                // layer.add(test)
                const subQuestionText = new Konva.Text({
                  x: 30,
                  y: currentY + 20,
                  width: stage.width() - 60,
                  text: subQuestion.title,
                  lineHeight: 1.2,
                  fontSize: 20,
                  fontFamily: 'Roboto',
                  fill: subQuestion.getColorClass(),
                })
                subQuestionFrame.setAttr('height', subQuestionText.height() + 20)

                // SUB-QUESTION COMMENT
                let subQuestionComment
                if (subQuestion.comment) {
                  subQuestionComment = new Konva.Text({
                    x: 30,
                    y: subQuestionText.y() + subQuestionText.height(),
                    width: stage.width() - 40,
                    text: subQuestion.comment,
                    lineHeight: 1.2,
                    fontSize: 15,
                    fontFamily: 'Roboto',
                    fill: '#888',
                  })
                  subQuestionFrame.setAttr('height', subQuestionFrame.height() + subQuestionComment.height())
                }
                layer.add(subQuestionFrame)
                layer.add(subQuestionText)
                if (subQuestion.comment && subQuestionComment) {
                  layer.add(subQuestionComment)
                }
                currentY += subQuestionFrame.height()
              })
            layer.add(name)
          })

        stage.height(currentY + 30)
        stage.add(layer)
        layer.draw()
        resolve(stage)
      }
      avatarImage.src = candidate.photoPath
      avatarImage.crossOrigin = 'Anonymous'
    })
  }
}
